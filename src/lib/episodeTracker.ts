import { Video } from '@/types';
import { getSettings } from './settingsManager';

const EPISODE_TRACKER_KEY = 'tv-yuri-episode-tracker';

interface EpisodeData {
  lastPlayed: number; // timestamp
  minutesPlayed: number; // total de minutos jogados no dia
}

/**
 * Obtém o histórico de reprodução do show
 */
function getShowHistory(showId: string): Record<string, EpisodeData> {
  if (typeof window === 'undefined') return {};
  try {
    const allData = JSON.parse(localStorage.getItem(EPISODE_TRACKER_KEY) || '{}');
    return allData[showId] || {};
  } catch {
    return {};
  }
}

/**
 * Salva o histórico de reprodução do show
 */
function saveShowHistory(showId: string, history: Record<string, EpisodeData>): void {
  if (typeof window === 'undefined') return;
  try {
    const allData = JSON.parse(localStorage.getItem(EPISODE_TRACKER_KEY) || '{}');
    allData[showId] = history;
    localStorage.setItem(EPISODE_TRACKER_KEY, JSON.stringify(allData));
  } catch (error) {
    console.error('Erro ao salvar histórico de episódios:', error);
  }
}

/**
 * Marca um episódio como assistido (usado para controle de limite diário)
 */
export function markEpisodeAsPlayed(videoId: string, minutes: number): void {
  const showId = extractShowId(videoId);
  const history = getShowHistory(showId);
  const today = new Date().toISOString().split('T')[0];

  const episodeData: EpisodeData = {
    lastPlayed: Date.now(),
    minutesPlayed: minutes,
  };

  history[videoId] = episodeData;
  saveShowHistory(showId, history);
}

/**
 * Verifica se o show atingiu o limite de minutos diário
 */
export function hasReachedDailyLimit(showId: string, maxMinutes: number): boolean {
  const history = getShowHistory(showId);
  const today = new Date().toISOString().split('T')[0];
  let totalMinutesToday = 0;

  for (const videoId in history) {
    const episodeData = history[videoId];
    const episodeDate = new Date(episodeData.lastPlayed).toISOString().split('T')[0];
    if (episodeDate === today) {
      totalMinutesToday += episodeData.minutesPlayed;
    }
  }

  return totalMinutesToday >= maxMinutes;
}

/**
 * Extrai o ID do show a partir do ID do vídeo (ex: 'bluey-001' -> 'bluey')
 */
export function extractShowId(videoId: string): string {
  const match = videoId.match(/^([a-z0-9-]+)-\d+$/);
  return match ? match[1] : videoId;
}

/**
 * Seleciona o próximo episódio de um show, priorizando o que não foi visto recentemente
 */
export function getNextEpisode(showId: string, episodes: Video[]): Video | null {
  const history = getShowHistory(showId);
  const settings = getSettings();
  const now = Date.now();

  // 1. Filtra episódios que não foram vistos no período de "recentemente"
  const availableEpisodes = episodes.filter(episode => {
    const data = history[episode.id];
    if (!data) return true; // Nunca visto

    // Se o vídeo foi visto, verifica se o tempo desde a última vez é maior que o limite
    const minutesSinceLastPlayed = (now - data.lastPlayed) / (1000 * 60);
    return minutesSinceLastPlayed > settings.maxContinuousPerShowMinutes;
  });

  if (availableEpisodes.length > 0) {
    // 2. Tenta selecionar o episódio com o menor número (se for o caso)
    const sorted = availableEpisodes.sort((a, b) => {
      const numA = parseInt(a.id.match(/\d+$/)?.[0] || '0');
      const numB = parseInt(b.id.match(/\d+$/)?.[0] || '0');
      return numA - numB;
    });
    return sorted[0];
  }

  // 3. Se todos foram vistos recentemente, retorna o que foi visto há mais tempo
  const allEpisodesWithHistory = episodes
    .map(episode => ({
      episode,
      lastPlayed: history[episode.id]?.lastPlayed || 0,
    }))
    .sort((a, b) => a.lastPlayed - b.lastPlayed); // Mais antigo primeiro

  return allEpisodesWithHistory[0]?.episode || null;
}
