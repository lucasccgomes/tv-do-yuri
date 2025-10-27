export type VideoCategory = 'cartoon' | 'educational_clip' | 'commercial';

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
  lastWatchedPosition?: number; // Posição em segundos onde o vídeo foi pausado
  lastWatchedDate?: string; // Data em que o vídeo foi pausado (YYYY-MM-DD)
  endAt?: number;
}

export interface VideoFolder {
  id: string;
  name: string;
  category: VideoCategory;
  videos: Video[];
  description?: string;
  icon?: string;
}

export interface PlaylistItem {
  video: Video;
  reason: string;
  startAt?: number;   // início do bloco
  endAt?: number;     // fim do bloco (corte do segmento)
}




export interface AppSettings {
  dailyScreenTimeLimit: number; // em minutos (padrão: 60)
  maxSessionDuration: number; // em minutos (padrão: 15)
  prioritizedSkills: SkillCategory[]; // Habilidades priorizadas
  allowedCategories: VideoCategory[]; // Categorias de conteúdo permitidas
  enabledParentalControls: boolean; // Se os controles parentais estão ativados
  allowVideoResumption: boolean; // Permitir que vídeos longos sejam retomados de onde pararam
  interruptLongVideos: boolean; // Interromper vídeos que excedem a duração máxima da sessão
  // NOVOS
  maxContinuousPerShowMinutes: number;     // ex.: 20 min por desenho no mesmo dia
  interstitialEveryMinutes: number;       // ex.: 8–10 (opcional, caso queira)
  interstitialDurationSeconds: number;    // ex.: 60–90 (opcional)
}

export interface DailyUsageStats {
  date: string; // YYYY-MM-DD
  totalMinutesWatched: number;
  videosWatched: string[]; // IDs dos vídeos assistidos
}

