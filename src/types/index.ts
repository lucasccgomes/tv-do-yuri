export type VideoCategory = 'cartoon' | 'educational_clip' | 'commercial' | 'movie'; // 'movie' adicionado

export type SkillCategory = 
  | 'language'
  | 'motor_skills'
  | 'cognitive'
  | 'socioemotional'
  | 'creativity';

export interface Video {
  id: string;
  title: string;
  category: VideoCategory;
  duration: number; // em segundos
  thumbnail?: string;
  url: string;
  ageRecommendation: '3-4' | '4-5' | '5-6' | 'all';
  educationalValue?: string;
  description?: string;
  skills?: SkillCategory[]; // Habilidades que o vídeo desenvolve
  endAt?: number; // Fim do vídeo (pode ser sobrescrito por blocos)
}

export interface VideoFolder {
  id: string;
  name: string;
  category: VideoCategory;
  videos: Video[];
  description?: string;
  icon?: string;
}

/**
 * @deprecated Não é mais usado no sistema de programação ao vivo
 * Mantido para compatibilidade com código legado
 */
export interface PlaylistItem {
  video: Video;
  reason: string;
  startAt?: number;
  endAt?: number;
}

export interface AppSettings {
  autoplay?: boolean;
  defaultVolume?: number;
  prioritizedSkills: SkillCategory[];
  allowedCategories: VideoCategory[];

  // tornar opcionais:
  dailyScreenTimeLimit?: number;
  maxSessionDuration?: number;
  maxContinuousPerShowMinutes?: number;
  interstitialEveryMinutes?: number;
  interstitialDurationSeconds?: number;

  enabledParentalControls?: boolean;
  interruptLongVideos?: boolean;
  allowVideoResumption?: boolean;
}


export interface ProgrammingContext {
  lastCategory: VideoCategory | null;
  consecutiveSameShow: number;
  lastShowId: string | null;
  usedToday: Set<string>;
  showMinutesToday: Record<string, number>;
  currentVideo: Video; // Adicionado
  allVideos: Video[]; // Adicionado
  playlist: PlaylistItem[]; // Adicionado
  currentIndex: number; // Adicionado
}

export interface DailyUsageStats {
  date: string; // YYYY-MM-DD
  totalMinutesWatched: number;
  videosWatched: string[]; // IDs dos vídeos assistidos
}
