// src/lib/videoUrl.ts
import type { Video } from '@/types';
import { resolveCategoryPath } from './categoryPath';

// Gera a URL para o player apontar para a nossa API de streaming
export function getVideoSrc(video: Video): string {
  // Supondo que cada Video tem: { category: VideoCategory; fileName?: string; path?: string; }
  // Preferimos 'path' absoluto quando houver; do contrário, montamos com base em fileName + categoria
  const path = video.path
    ? video.path
    : `${resolveCategoryPath(video.category)}/${encodeURIComponent(video.fileName || '')}`;

  // A API espera `path` absoluto a partir do root do user (começando com /Videos/..)
  // Aqui garantimos que a query volte sem duplo-encode:
  return `/api/stream?path=${encodeURIComponent(path)}`;
}
