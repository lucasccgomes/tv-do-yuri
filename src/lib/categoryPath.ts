// src/lib/categoryPath.ts
import type { VideoCategory } from '@/types';

const ROOT = process.env.NEXTCLOUD_ROOT_DIR || '/Videos/tv-do-yuri/videos';

export function resolveCategoryPath(category: VideoCategory): string {
  // Pastas reais (sua captura de tela):
  // cartoons, comercial, educational, filmes
  switch (category) {
    case 'cartoon':
      return `${ROOT}/cartoons`;
    case 'commercial':
      return `${ROOT}/comercial`;
    case 'educational_clip':
      return `${ROOT}/educational`;
    case 'movie':
      return `${ROOT}/filmes`;
    default:
      return ROOT;
  }
}
