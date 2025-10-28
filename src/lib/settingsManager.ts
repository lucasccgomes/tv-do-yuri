import { AppSettings, DailyUsageStats, SkillCategory, VideoCategory } from '@/types';

const SETTINGS_KEY = 'tv-yuri-settings';
const USAGE_STATS_KEY = 'tv-yuri-usage-stats';

// Configurações padrão
const DEFAULT_SETTINGS: AppSettings = {
  dailyScreenTimeLimit: 60, // 60 minutos conforme recomendações OMS/AAP
  maxSessionDuration: 15, // 15 minutos para respeitar a capacidade de atenção
  prioritizedSkills: ['language', 'motor_skills', 'cognitive'], // Habilidades padrão
  allowedCategories: ["cartoon", "educational_clip", "commercial"],
  enabledParentalControls: true,
  allowVideoResumption: true, // Padrão: permitir retomada
  interruptLongVideos: true, // Padrão: interromper vídeos longos
  maxContinuousPerShowMinutes: 20,   // Em minutos: ex.: 20 min por desenho no mesmo dia
  interstitialEveryMinutes: 10,      // Em minutos: a cada quantos minutos de vídeo um comercial deve aparecer
  interstitialDurationSeconds: 60,   // Em segundos: duração do comercial
};

/**
 * Obtém as configurações salvas ou retorna as configurações padrão
 */
export function getSettings(): AppSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
  }

  return DEFAULT_SETTINGS;
}

/**
 * Salva as configurações no localStorage
 */
export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
  }
}

/**
 * Reseta as configurações para os valores padrão
 */
export function resetSettings(): AppSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Erro ao resetar configurações:', error);
  }

  return DEFAULT_SETTINGS;
}

/**
 * Obtém as estatísticas de uso do dia atual
 */
export function getTodayUsageStats(): DailyUsageStats {
  if (typeof window === 'undefined') {
    return {
      date: new Date().toISOString().split('T')[0],
      totalMinutesWatched: 0,
      videosWatched: [],
    };
  }

  const today = new Date().toISOString().split('T')[0];

  try {
    const allStats = localStorage.getItem(USAGE_STATS_KEY);
    if (allStats) {
      const stats = JSON.parse(allStats);
      return stats[today] || {
        date: today,
        totalMinutesWatched: 0,
        videosWatched: [],
      };
    }
  } catch (error) {
    console.error('Erro ao carregar estatísticas de uso:', error);
  }

  return {
    date: today,
    totalMinutesWatched: 0,
    videosWatched: [],
  };
}

/**
 * Salva as estatísticas de uso do dia
 */
export function saveTodayUsageStats(stats: DailyUsageStats): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const allStats = localStorage.getItem(USAGE_STATS_KEY);
    const statsObj = allStats ? JSON.parse(allStats) : {};
    statsObj[stats.date] = stats;
    localStorage.setItem(USAGE_STATS_KEY, JSON.stringify(statsObj));
  } catch (error) {
    console.error('Erro ao salvar estatísticas de uso:', error);
  }
}

/**
 * Salva a posição de um vídeo para retomada futura
 */
export function saveVideoProgress(videoId: string, position: number): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const allVideosProgress = JSON.parse(localStorage.getItem('tv-yuri-video-progress') || '{}');
    allVideosProgress[videoId] = { position, date: new Date().toISOString().split('T')[0] };
    localStorage.setItem('tv-yuri-video-progress', JSON.stringify(allVideosProgress));
  } catch (error) {
    console.error('Erro ao salvar progresso do vídeo:', error);
  }
}

/**
 * Obtém a posição salva de um vídeo
 */
export function getVideoProgress(videoId: string): { position: number; date: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const allVideosProgress = JSON.parse(localStorage.getItem('tv-yuri-video-progress') || '{}');
    // antes checava se progress.date === hoje; agora retorna sempre que existir
    return allVideosProgress[videoId] ?? null;
  } catch (error) {
    console.error('Erro ao carregar progresso do vídeo:', error);
    return null;
  }
}

/**
 * Verifica se o limite de tempo diário foi atingido
 */
export function isDailyLimitReached(): boolean {
  const settings = getSettings();
  const todayStats = getTodayUsageStats();
  return todayStats.totalMinutesWatched >= settings.dailyScreenTimeLimit;
}

/**
 * Retorna o tempo restante disponível para hoje (em minutos)
 */
export function getRemainingDailyTime(): number {
  const settings = getSettings();
  const todayStats = getTodayUsageStats();
  const remaining = settings.dailyScreenTimeLimit - todayStats.totalMinutesWatched;
  return Math.max(0, remaining);
}

/**
 * Acumula tempo assistido (em segundos) com precisão.
 * Converte para minutos inteiros automaticamente quando cruza múltiplos de 60.
 * Garante que videosWatched não duplique IDs.
 */
export function addViewingTime(videoId: string, deltaSeconds: number): void {
  if (typeof window === 'undefined') return;

  // Guarda segundos por dia num storage separado
  const SEC_KEY = 'tv-yuri-usage-seconds';
  const today = new Date().toISOString().split('T')[0];

  let perDaySeconds: Record<string, number> = {};
  try {
    perDaySeconds = JSON.parse(localStorage.getItem(SEC_KEY) || '{}');
  } catch { perDaySeconds = {}; }

  const prevSec = perDaySeconds[today] || 0;
  const nextSec = Math.max(0, prevSec + Math.max(0, Math.floor(deltaSeconds)));

  // Atualiza segundos totais do dia
  perDaySeconds[today] = nextSec;
  localStorage.setItem(SEC_KEY, JSON.stringify(perDaySeconds));

  // Converte para minutos inteiros e atualiza o objeto principal
  const wholeMinutes = Math.floor(nextSec / 60);
  const stats = getTodayUsageStats();
  if (wholeMinutes !== stats.totalMinutesWatched) {
    stats.totalMinutesWatched = wholeMinutes;
  }

  // Evita duplicatas em videosWatched
  if (!stats.videosWatched.includes(videoId)) {
    stats.videosWatched.push(videoId);
  }

  saveTodayUsageStats(stats);
}


/**
 * Retorna uma descrição legível da habilidade
 */
export function getSkillLabel(skill: SkillCategory): string {
  const labels: Record<SkillCategory, string> = {
    language: '🗣️ Linguagem e Comunicação',
    motor_skills: '🤸 Coordenação Motora',
    cognitive: '🧠 Cognitivo e Resolução de Problemas',
    socioemotional: '❤️ Socioemocional',
    creativity: '🎨 Criatividade e Expressão',
  };

  return labels[skill];
}

/**
 * Retorna uma descrição legível da categoria de vídeo
 */
export function getCategoryLabel(category: VideoCategory): string {
  const labels: Record<VideoCategory, string> = {
    cartoon: '🎬 Desenho',
    educational_clip: '📚 Clipe Educativo',
    commercial: '📢 Comercial Educativo',
    movie: '🍿 Filme/Especial', // Adicionado
  };

  return labels[category];
}

