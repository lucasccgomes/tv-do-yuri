/**
 * Integração com Nextcloud para carregar vídeos dinamicamente
 * Busca vídeos no Nextcloud e cria o mockData automaticamente
 */

import { Video, VideoFolder } from '@/types';

interface NextcloudFile {
  href: string;
  basename: string;
  lastmod: string;
  size: number;
  type: 'file' | 'directory';
  etag: string;
  mime?: string;
}

interface NextcloudConfig {
  baseUrl: string;
  username: string;
  password: string;
  basePath: string;
}

/**
 * Obtém configuração do Nextcloud das variáveis de ambiente
 */
function getNextcloudConfig(): NextcloudConfig {
  return {
    baseUrl: process.env.NEXTCLOUD_BASE_URL || '',
    username: process.env.NEXTCLOUD_USERNAME || '',
    password: process.env.NEXTCLOUD_APP_PASSWORD || '',
    basePath: process.env.NEXT_PUBLIC_NC_BASE_PATH || '/Videos/tv-do-yuri/public',
  };
}

/**
 * Faz requisição WebDAV ao Nextcloud
 */
async function webdavRequest(path: string, method: string = 'PROPFIND'): Promise<Response> {
  const config = getNextcloudConfig();
  
  const url = `${config.baseUrl}/remote.php/dav/files/${encodeURIComponent(config.username)}${path}`;
  
  const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');
  
  const headers: Record<string, string> = {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/xml',
  };
  
  if (method === 'PROPFIND') {
    headers['Depth'] = '1';
  }
  
  const body = method === 'PROPFIND' ? `<?xml version="1.0"?>
    <d:propfind xmlns:d="DAV:">
      <d:prop>
        <d:resourcetype />
        <d:getcontentlength />
        <d:getlastmodified />
        <d:getetag />
        <d:getcontenttype />
      </d:prop>
    </d:propfind>` : undefined;
  
  return fetch(url, {
    method,
    headers,
    body,
  });
}

/**
 * Lista arquivos em um diretório do Nextcloud
 */
async function listFiles(path: string): Promise<NextcloudFile[]> {
  try {
    const response = await webdavRequest(path, 'PROPFIND');
    
    if (!response.ok) {
      console.error('Erro ao listar arquivos:', response.status, response.statusText);
      return [];
    }
    
    const text = await response.text();
    
    // Parse XML simples (em produção, use um parser XML adequado)
    const files: NextcloudFile[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');
    const responses = doc.getElementsByTagName('d:response');
    
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      const href = response.getElementsByTagName('d:href')[0]?.textContent || '';
      const resourcetype = response.getElementsByTagName('d:resourcetype')[0];
      const isDirectory = resourcetype?.getElementsByTagName('d:collection').length > 0;
      const size = parseInt(response.getElementsByTagName('d:getcontentlength')[0]?.textContent || '0');
      const lastmod = response.getElementsByTagName('d:getlastmodified')[0]?.textContent || '';
      const etag = response.getElementsByTagName('d:getetag')[0]?.textContent || '';
      const mime = response.getElementsByTagName('d:getcontenttype')[0]?.textContent || '';
      
      const basename = decodeURIComponent(href.split('/').filter(Boolean).pop() || '');
      
      if (basename && basename !== path.split('/').filter(Boolean).pop()) {
        files.push({
          href,
          basename,
          lastmod,
          size,
          type: isDirectory ? 'directory' : 'file',
          etag,
          mime,
        });
      }
    }
    
    return files;
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    return [];
  }
}

/**
 * Extrai metadados de um nome de arquivo
 * Ex: "bluey-001-jogos-magicos.mp4" -> { show: "bluey", episode: "001", title: "Jogos Mágicos" }
 */
function parseVideoFilename(filename: string): {
  id: string;
  show: string;
  episode: string;
  title: string;
  category: string;
} {
  const nameWithoutExt = filename.replace(/\.[^.]+$/, '');
  const parts = nameWithoutExt.split('-');
  
  if (parts.length < 2) {
    return {
      id: nameWithoutExt,
      show: 'unknown',
      episode: '000',
      title: nameWithoutExt,
      category: 'cartoon',
    };
  }
  
  const show = parts[0];
  const episode = parts[1];
  const titleParts = parts.slice(2);
  const title = titleParts
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Determina categoria baseada no nome do show
  let category = 'cartoon';
  if (['bita', 'galinha', 'palavra', 'luna', 'edu'].some(edu => show.includes(edu))) {
    category = 'educational_clip';
  } else if (show.includes('comercial') || show.includes('ad')) {
    category = 'commercial';
  } else if (show.includes('movie') || show.includes('filme')) {
    category = 'movie';
  }
  
  return {
    id: `${show}-${episode}`,
    show,
    episode,
    title: title || `${show} - Episódio ${episode}`,
    category,
  };
}

/**
 * Obtém duração de um vídeo (aproximada baseada no tamanho)
 * Em produção, você deve usar ffprobe ou similar
 */
function estimateVideoDuration(sizeBytes: number): number {
  // Estimativa: ~1MB por minuto de vídeo em qualidade média
  const sizeMB = sizeBytes / (1024 * 1024);
  const estimatedMinutes = sizeMB / 1;
  return Math.round(estimatedMinutes * 60); // segundos
}

/**
 * Carrega vídeos de uma pasta do Nextcloud
 */
export async function loadVideosFromNextcloud(folderPath: string): Promise<Video[]> {
  const config = getNextcloudConfig();
  const fullPath = `${config.basePath}${folderPath}`;
  
  console.log(`📁 Carregando vídeos de: ${fullPath}`);
  
  const files = await listFiles(fullPath);
  
  const videos: Video[] = [];
  
  for (const file of files) {
    if (file.type === 'file' && file.mime?.startsWith('video/')) {
      const metadata = parseVideoFilename(file.basename);
      const duration = estimateVideoDuration(file.size);
      
      const video: Video = {
        id: metadata.id,
        title: metadata.title,
        category: metadata.category as any,
        duration,
        url: `${folderPath}/${file.basename}`,
        ageRecommendation: '3-4',
        thumbnail: `${folderPath}/thumbnails/${file.basename.replace(/\.[^.]+$/, '.jpg')}`,
      };
      
      videos.push(video);
    }
  }
  
  console.log(`✅ ${videos.length} vídeos carregados de ${folderPath}`);
  
  return videos;
}

/**
 * Carrega todos os vídeos do Nextcloud
 */
export async function loadAllVideosFromNextcloud(): Promise<Video[]> {
  const folders = [
    '/videos/bluey',
    '/videos/peppa',
    '/videos/luna',
    '/videos/bita',
    '/videos/galinha',
    '/videos/palavra',
    '/commercials',
    '/movies',
  ];
  
  const allVideos: Video[] = [];
  
  for (const folder of folders) {
    try {
      const videos = await loadVideosFromNextcloud(folder);
      allVideos.push(...videos);
    } catch (error) {
      console.error(`Erro ao carregar ${folder}:`, error);
    }
  }
  
  console.log(`📺 Total de vídeos carregados: ${allVideos.length}`);
  
  return allVideos;
}

/**
 * Carrega vídeos e agrupa por show
 */
export async function loadVideoFoldersFromNextcloud(): Promise<VideoFolder[]> {
  const allVideos = await loadAllVideosFromNextcloud();
  
  const showMap: Record<string, Video[]> = {};
  
  for (const video of allVideos) {
    const metadata = parseVideoFilename(video.id);
    const showId = metadata.show;
    
    if (!showMap[showId]) {
      showMap[showId] = [];
    }
    
    showMap[showId].push(video);
  }
  
  const folders: VideoFolder[] = [];
  
  for (const showId in showMap) {
    const videos = showMap[showId];
    const firstVideo = videos[0];
    
    folders.push({
      id: `${showId}-folder`,
      name: showId.charAt(0).toUpperCase() + showId.slice(1),
      category: firstVideo.category,
      videos,
      description: `${videos.length} episódios`,
      icon: getCategoryIcon(firstVideo.category),
    });
  }
  
  return folders;
}

/**
 * Obtém ícone baseado na categoria
 */
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    cartoon: '🎨',
    educational_clip: '📚',
    commercial: '📺',
    movie: '🎬',
  };
  
  return icons[category] || '📺';
}

/**
 * Hook React para carregar vídeos do Nextcloud
 */
export function useNextcloudVideos() {
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [folders, setFolders] = React.useState<VideoFolder[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [loadedVideos, loadedFolders] = await Promise.all([
          loadAllVideosFromNextcloud(),
          loadVideoFoldersFromNextcloud(),
        ]);
        
        setVideos(loadedVideos);
        setFolders(loadedFolders);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar vídeos:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }
    
    load();
  }, []);
  
  return { videos, folders, loading, error };
}

// Importação do React para o hook
import React from 'react';

