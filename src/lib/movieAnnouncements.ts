/**
 * Sistema de Anúncios de Filmes
 * Gera anúncios automáticos 5 dias antes do filme
 */

import { Video } from '@/types';
import { ScheduledMovie, MOVIE_ANNOUNCEMENT_CONFIG } from './programmingConfig';

export interface MovieAnnouncement extends Video {
  movieId: string;
  movieTitle: string;
  movieDate: string;
  movieTime: string;
  daysUntilMovie: number;
}

/**
 * Calcula quantos dias faltam até uma data
 */
function daysUntil(targetDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Formata uma data para exibição
 * Ex: "2025-11-04" -> "04 de Novembro"
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  
  return `${day} de ${month}`;
}

/**
 * Gera um vídeo de anúncio de filme
 */
function generateMovieAnnouncementVideo(
  movie: ScheduledMovie,
  daysUntil: number
): MovieAnnouncement {
  const formattedDate = formatDate(movie.date);
  
  return {
    id: `announcement-${movie.id}-${daysUntil}`,
    title: `🎬 TEM FILME! ${movie.title.toUpperCase()}`,
    category: 'commercial',
    duration: MOVIE_ANNOUNCEMENT_CONFIG.announcementDuration,
    url: '/videos/movie-announcement-template.mp4', // Template que será sobreposto com texto
    ageRecommendation: 'all',
    description: `Programado para ${formattedDate} às ${movie.time}`,
    
    // Dados específicos do anúncio
    movieId: movie.id,
    movieTitle: movie.title,
    movieDate: formattedDate,
    movieTime: movie.time,
    daysUntilMovie: daysUntil,
  } as MovieAnnouncement;
}

/**
 * Obtém todos os anúncios de filmes que devem ser exibidos hoje
 */
export function getTodayMovieAnnouncements(scheduledMovies: ScheduledMovie[]): MovieAnnouncement[] {
  const announcements: MovieAnnouncement[] = [];
  
  for (const movie of scheduledMovies) {
    const days = daysUntil(movie.date);
    
    // Se faltam entre 1 e 5 dias, gera anúncios
    if (days > 0 && days <= MOVIE_ANNOUNCEMENT_CONFIG.daysBeforeAnnouncement) {
      const announcement = generateMovieAnnouncementVideo(movie, days);
      announcements.push(announcement);
    }
  }
  
  return announcements;
}

/**
 * Gera o texto do anúncio para ser exibido na tela
 */
export function generateAnnouncementText(announcement: MovieAnnouncement): string {
  const plural = announcement.daysUntilMovie > 1 ? 'DIAS' : 'DIA';
  
  return `
🎬 TEM FILME! 🎬

${announcement.movieTitle.toUpperCase()}

PROGRAMADO PARA
${announcement.movieDate}
ÀS ${announcement.movieTime}

FALTAM ${announcement.daysUntilMovie} ${plural}!
  `.trim();
}

/**
 * Gera o áudio do anúncio (texto para ser lido por TTS)
 */
export function generateAnnouncementSpeech(announcement: MovieAnnouncement): string {
  const plural = announcement.daysUntilMovie > 1 ? 'dias' : 'dia';
  
  return `Atenção! Tem filme programado! ${announcement.movieTitle}! ` +
         `Dia ${announcement.movieDate}, às ${announcement.movieTime}. ` +
         `Faltam ${announcement.daysUntilMovie} ${plural}! Não perca!`;
}

/**
 * Verifica se um filme está programado para hoje
 */
export function getMovieScheduledForToday(scheduledMovies: ScheduledMovie[]): ScheduledMovie | null {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  for (const movie of scheduledMovies) {
    if (movie.date === today) {
      return movie;
    }
  }
  
  return null;
}

/**
 * Cria um componente React para exibir o anúncio
 * (Este é o template que será usado)
 */
export interface AnnouncementDisplayProps {
  announcement: MovieAnnouncement;
  onComplete: () => void;
}

/**
 * Dados para o componente de anúncio
 */
export function getAnnouncementDisplayData(announcement: MovieAnnouncement) {
  return {
    text: generateAnnouncementText(announcement),
    speech: generateAnnouncementSpeech(announcement),
    duration: MOVIE_ANNOUNCEMENT_CONFIG.announcementDuration * 1000, // ms
    soundEffect: MOVIE_ANNOUNCEMENT_CONFIG.soundEffect,
    thumbnail: announcement.movieId ? `/images/movies/${announcement.movieId}-thumb.jpg` : undefined,
  };
}

/**
 * Distribui anúncios ao longo do dia
 * Retorna os horários em que os anúncios devem aparecer
 */
export function distributeAnnouncementTimes(
  startTime: string, // HH:MM
  endTime: string, // HH:MM
  count: number
): string[] {
  const times: string[] = [];
  
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  const totalMinutes = endMinutes - startMinutes;
  
  const interval = Math.floor(totalMinutes / (count + 1));
  
  for (let i = 1; i <= count; i++) {
    const minutes = startMinutes + (interval * i);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    times.push(`${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`);
  }
  
  return times;
}

/**
 * Exemplo de uso:
 * 
 * const scheduledMovies = [
 *   {
 *     id: 'movie-aventureiro',
 *     title: 'O Aventureiro',
 *     date: '2025-11-04',
 *     time: '18:00',
 *     duration: 90,
 *   }
 * ];
 * 
 * // Obter anúncios de hoje
 * const announcements = getTodayMovieAnnouncements(scheduledMovies);
 * 
 * // Distribuir ao longo do dia
 * const times = distributeAnnouncementTimes('07:00', '20:00', 5);
 * 
 * // Adicionar à grade
 * times.forEach((time, index) => {
 *   if (announcements[0]) {
 *     schedule.push({
 *       time,
 *       videoId: announcements[0].id,
 *       title: announcements[0].title,
 *       category: 'commercial',
 *     });
 *   }
 * });
 */

