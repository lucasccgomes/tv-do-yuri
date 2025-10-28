/**
 * Gerador Automático de Grade de Programação
 * Cria a grade semanal baseada em categorias e regras
 */

import { Video } from '@/types';
import {
  CATEGORY_CONFIG,
  BROADCAST_CONFIG,
  DISTRIBUTION_RULES,
  timeToMinutes,
  getTimeSlotWeight,
} from './programmingConfig';
import {
  getNextEpisode,
  hasReachedDailyLimit,
  extractShowId,
} from './episodeTracker';

export interface ScheduledProgram {
  time: string; // HH:MM:SS
  videoId: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  startAt?: number;
  duration: number;
  endAt?: number;
  category: string;
}

interface VideoPool {
  educational: Video[];
  cartoon: Video[];
  commercial: Video[];
  movie: Video[];
}

/**
 * Agrupa vídeos por categoria
 */
function groupVideosByCategory(allVideos: Video[]): VideoPool {
  return {
    educational: allVideos.filter(v => v.category === 'educational_clip'),
    cartoon: allVideos.filter(v => v.category === 'cartoon'),
    commercial: allVideos.filter(v => v.category === 'commercial'),
    movie: allVideos.filter(v => v.category === 'movie'),
  };
}

/**
 * Agrupa desenhos por show
 */
function groupCartoonsByShow(cartoons: Video[]): Record<string, Video[]> {
  const shows: Record<string, Video[]> = {};
  
  for (const video of cartoons) {
    const showId = extractShowId(video.id);
    if (!shows[showId]) {
      shows[showId] = [];
    }
    shows[showId].push(video);
  }
  
  return shows;
}

/**
 * Seleciona o próximo vídeo de uma categoria
 */
function selectNextVideo(
  category: string,
  pool: VideoPool,
  usedToday: Set<string>,
  showMinutesToday: Record<string, number>
): Video | null {
  let candidates: Video[] = [];
  
  switch (category) {
    case 'educational_clip':
      candidates = pool.educational.filter(v => !usedToday.has(v.id));
      break;
      
    case 'cartoon': {
      // Agrupa por show e seleciona o próximo episódio de cada
      const shows = groupCartoonsByShow(pool.cartoon);
      const availableShows: string[] = [];
      
      for (const showId in shows) {
        // Verifica se o show não atingiu o limite diário
        if (!hasReachedDailyLimit(showId, DISTRIBUTION_RULES.maxMinutesPerShowPerDay)) {
          availableShows.push(showId);
        }
      }
      
      if (availableShows.length === 0) {
        // Todos os shows atingiram o limite, reseta
        return null;
      }
      
      // Seleciona um show aleatório (ou o que tem menos minutos hoje)
      const selectedShow = availableShows.sort((a, b) => {
        const minutesA = showMinutesToday[a] || 0;
        const minutesB = showMinutesToday[b] || 0;
        return minutesA - minutesB;
      })[0];
      
      // Obtém o próximo episódio desse show
      const nextEpisode = getNextEpisode(selectedShow, shows[selectedShow]);
      if (nextEpisode && !usedToday.has(nextEpisode.id)) {
        return nextEpisode;
      }
      break;
    }
      
    case 'commercial':
      // Comerciais podem repetir, então não filtra por usedToday
      candidates = pool.commercial;
      break;
      
    case 'movie':
      candidates = pool.movie.filter(v => !usedToday.has(v.id));
      break;
  }
  
  if (candidates.length === 0) return null;
  
  // Filtra por duração adequada
  const config = CATEGORY_CONFIG[category];
  if (config) {
    candidates = candidates.filter(v => {
      const durationMin = v.duration / 60;
      return durationMin >= config.minDurationMinutes && durationMin <= config.maxDurationMinutes;
    });
  }
  
  if (candidates.length === 0) return null;
  
  // Seleciona aleatoriamente (pode ser melhorado com pesos)
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * Gera a grade de um dia
 */
export function generateDaySchedule(
  allVideos: Video[],
  dayOfWeek: number, // 0-6
  _seed?: number // Para reproduzibilidade
): ScheduledProgram[] {
  const schedule: ScheduledProgram[] = [];
  const pool = groupVideosByCategory(allVideos);
  const usedToday = new Set<string>();
  const showMinutesToday: Record<string, number> = {};
  
  // Converte horários para minutos
  const startMin = timeToMinutes(BROADCAST_CONFIG.startTime);
  const endMin = timeToMinutes(BROADCAST_CONFIG.endTime);
  
  let currentMin = startMin;

  let consecutiveSameShow = 0;
  let lastShowId: string | null = null;
  
  // Calcula quantos vídeos de cada categoria devem ser incluídos
  const categoryTargets: Record<string, number> = {};
  for (const cat in CATEGORY_CONFIG) {
    categoryTargets[cat] = CATEGORY_CONFIG[cat].dailyCount;
  }
  
  const categoryCount: Record<string, number> = {
    educational_clip: 0,
    cartoon: 0,
    commercial: 0,
    movie: 0,
  };
  
  // Loop principal de geração
  while (currentMin < endMin) {
    // Decide qual categoria usar
    let selectedCategory: string | null = null;
    
    // 1. Verifica se é hora de um comercial (a cada X minutos)
    const minutesSinceLastCommercial = schedule
      .slice()
      .reverse()
      .findIndex(p => p.category === 'commercial');
    
    if (minutesSinceLastCommercial === -1 || minutesSinceLastCommercial >= BROADCAST_CONFIG.commercialIntervalMinutes) {
      selectedCategory = 'commercial';
    }
    
    // 2. Se não é comercial, escolhe entre educacional e cartoon
    if (!selectedCategory) {
      // Calcula prioridades baseadas em:
      // - Quantos já foram usados vs target
      // - Peso do horário atual
      const priorities: Array<{ category: string; score: number }> = [];
      
      for (const cat of ['educational_clip', 'cartoon']) {
        const config = CATEGORY_CONFIG[cat];
        const target = categoryTargets[cat];
        const current = categoryCount[cat];
        const remaining = target - current;
        
        if (remaining > 0) {
          const timeWeight = getTimeSlotWeight(
            `${Math.floor(currentMin / 60)}:${currentMin % 60}`,
            cat
          );
          const completionRatio = current / target; // 0-1
          const urgency = 1 - completionRatio; // Quanto mais longe do target, mais urgente
          
          const score = config.priority * timeWeight * urgency * remaining;
          priorities.push({ category: cat, score });
        }
      }
      
      if (priorities.length > 0) {
        // Seleciona a categoria com maior score
        priorities.sort((a, b) => b.score - a.score);
        selectedCategory = priorities[0].category;
      }
    }
    
    if (!selectedCategory) {
      // Nenhuma categoria disponível, para
      break;
    }
    
    // Seleciona o vídeo
    let video = selectNextVideo(
      selectedCategory,
      pool,
      usedToday,
      showMinutesToday
    );
    
    if (!video) {
      // Não há mais vídeos disponíveis nesta categoria
      // Tenta outra categoria
      const otherCategories = Object.keys(CATEGORY_CONFIG).filter(c => c !== selectedCategory);
      let found = false;
      
      for (const cat of otherCategories) {
        const otherVideo = selectNextVideo(cat, pool, usedToday, showMinutesToday);
        if (otherVideo) {
          selectedCategory = cat;
          video = otherVideo;
          found = true;
          break;
        }
      }
      
      if (!found) {
        // Nenhum vídeo disponível, avança 5 minutos
        currentMin += 5;
        continue;
      }
    }

    if (!video) continue; // Adicionado: Garantir que video não é null
    
    // Verifica regra de episódios consecutivos do mesmo show
    if (selectedCategory === 'cartoon' && video) {
      const showId = extractShowId(video.id);
      
      if (showId === lastShowId) {
        consecutiveSameShow++;
        if (consecutiveSameShow >= BROADCAST_CONFIG.maxConsecutiveSameShow) {
          // Pula este vídeo e tenta outro show
          currentMin += 1;
          continue;
        }
      } else {
        consecutiveSameShow = 1;
        lastShowId = showId;
      }
      
      // Atualiza minutos do show hoje
      showMinutesToday[showId] = (showMinutesToday[showId] || 0) + (video.duration / 60);
    }
    
    // Adiciona à grade
    const hours = Math.floor(currentMin / 60);
    const minutes = currentMin % 60;
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    
    schedule.push({
      time: timeStr,
      videoId: video.id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      category: selectedCategory,
      duration: video.duration,
    });
    
    // Atualiza contadores
    usedToday.add(video.id);
    categoryCount[selectedCategory]++;
    
    // Avança o tempo
    currentMin += Math.ceil(video.duration / 60);
  }
  
  console.log(`📅 Grade gerada para dia ${dayOfWeek}:`, {
    total: schedule.length,
    educational: categoryCount.educational_clip,
    cartoon: categoryCount.cartoon,
    commercial: categoryCount.commercial,
    movie: categoryCount.movie,
  });
  
  return schedule;
}

/**
 * Gera a grade completa da semana
 */
export function generateWeekSchedule(allVideos: Video[]): Record<number, ScheduledProgram[]> {
  const weekSchedule: Record<number, ScheduledProgram[]> = {};
  
  for (let day = 0; day < 7; day++) {
    weekSchedule[day] = generateDaySchedule(allVideos, day, day * 1000);
  }
  
  return weekSchedule;
}

/**
 * Regenera a grade de um dia específico
 */
export function regenerateDaySchedule(
  allVideos: Video[],
  dayOfWeek: number
): ScheduledProgram[] {
  console.log(`🔄 Regenerando grade do dia ${dayOfWeek}...`);
  return generateDaySchedule(allVideos, dayOfWeek, Date.now());
}
