import { Video, PlaylistItem, ProgrammingContext } from '@/types';
import { extractShowId } from './episodeTracker';

/**
 * Regra 1: Após um episódio de desenho, intercalar 2 comerciais educativos
 * Depois adicionar outro programa educativo
 */
export function getNextVideoAfterCartoon(context: ProgrammingContext): Video | null {
  const { currentVideo, allVideos, playlist, currentIndex } = context;

  if (currentVideo.category !== 'cartoon') {
    return null;
  }

  let commercialCount = 0;
  for (let i = currentIndex + 1; i < playlist.length; i++) {
    if (playlist[i].video.category === 'commercial') {
      commercialCount++;
    } else {
      break;
    }
  }

  if (commercialCount < 2) {
    const commercials = allVideos.filter((v) => v.category === 'commercial');
    const usedCommercials = playlist
      .slice(Math.max(0, currentIndex - 5), currentIndex + 1)
      .map((p) => p.video.id);

    const availableCommercial = commercials.find((c) => !usedCommercials.includes(c.id));
    return availableCommercial || commercials[0];
  }

  if (commercialCount === 2) {
    const clips = allVideos.filter((v) => v.category === 'educational_clip');
    const usedClips = playlist
      .slice(Math.max(0, currentIndex - 5), currentIndex + 1)
      .map((p) => p.video.id);

    const availableClip = clips.find((c) => !usedClips.includes(c.id));
    return availableClip || clips[0];
  }

  return null;
}

/**
 * Regra 2: Variar os desenhos para manter a criança interessada
 */
export function getNextCartoon(context: ProgrammingContext): Video | null {
  const { currentVideo, allVideos, playlist, currentIndex } = context;

  if (currentVideo.category === 'cartoon') {
    return null;
  }

  const cartoons = allVideos.filter((v) => v.category === 'cartoon');

  const recentlyUsed = new Set<string>();
  for (let i = Math.max(0, currentIndex - 10); i <= currentIndex; i++) {
    if (i >= 0 && i < playlist.length) {
      if (playlist[i].video.category === 'cartoon') {
        recentlyUsed.add(playlist[i].video.id);
      }
    }
  }

  const availableCartoon = cartoons.find((c) => !recentlyUsed.has(c.id));
  return availableCartoon || cartoons[0];
}

/**
 * Regra 3: Equilibrar conteúdo educativo
 */
export function getEducationalClip(context: ProgrammingContext): Video | null {
  const { allVideos, playlist, currentIndex } = context;

  const clips = allVideos.filter((v) => v.category === 'educational_clip');

  const recentlyUsed = new Set<string>();
  for (let i = Math.max(0, currentIndex - 15); i <= currentIndex; i++) {
    if (i >= 0 && i < playlist.length) {
      if (playlist[i].video.category === 'educational_clip') {
        recentlyUsed.add(playlist[i].video.id);
      }
    }
  }

  const availableClip = clips.find((c) => !recentlyUsed.has(c.id));
  return availableClip || clips[0];
}

/**
 * Função principal que determina o próximo vídeo
 */
export function getNextVideo(context: ProgrammingContext): Video | null {
  const afterCartoon = getNextVideoAfterCartoon(context);
  if (afterCartoon) {
    return afterCartoon;
  }

  if (
    context.currentVideo.category === 'educational_clip' ||
    context.currentVideo.category === 'commercial'
  ) {
    const nextCartoon = getNextCartoon(context);
    if (nextCartoon) {
      return nextCartoon;
    }
  }

  if (context.currentVideo.category === 'cartoon') {
    return getEducationalClip(context);
  }

  return getNextCartoon(context);
}

/**
 * Gera uma playlist inicial com base nas regras
 */
export function generateInitialPlaylist(allVideos: Video[], length: number = 20): PlaylistItem[] {
  const playlist: PlaylistItem[] = [];
  const cartoons = allVideos.filter((v) => v.category === 'cartoon');

  if (cartoons.length === 0) {
    return [];
  }

  let currentVideo = cartoons[0];
  playlist.push({
    video: currentVideo,
    reason: 'Início da programação',
  });

  while (playlist.length < length) {
    const context: ProgrammingContext = {
      currentVideo,
      allVideos,
      playlist,
      currentIndex: playlist.length - 1,
      lastCategory: currentVideo.category,
      consecutiveSameShow: 1,
      lastShowId: extractShowId(currentVideo.id) || null,
      usedToday: new Set(playlist.map(p => p.video.id)),
      showMinutesToday: {}, // Não é usado aqui, mas é necessário para a interface
    };

    const nextVideo = getNextVideo(context);
    if (!nextVideo) {
      break;
    }

    let reason = 'Próximo na sequência';
    if (currentVideo.category === 'cartoon' && nextVideo.category === 'commercial') {
      reason = 'Comercial educativo após episódio';
    } else if (
      currentVideo.category === 'commercial' &&
      nextVideo.category === 'educational_clip'
    ) {
      reason = 'Clipe educativo após comercial';
    } else if (
      currentVideo.category === 'educational_clip' &&
      nextVideo.category === 'cartoon'
    ) {
      reason = 'Retorno ao desenho';
    }

    playlist.push({
      video: nextVideo,
      reason,
    });

    currentVideo = nextVideo;
  }

  return playlist;
}
