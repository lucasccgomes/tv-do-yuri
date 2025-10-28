/**
 * Configuração de Programação Automática
 * Define regras para cada categoria de conteúdo
 */

export interface CategoryConfig {
  name: string;
  minDurationMinutes: number; // Duração mínima de cada vídeo
  maxDurationMinutes: number; // Duração máxima de cada vídeo
  dailyCount: number; // Quantos por dia
  preferredTimeSlots: TimeSlot[]; // Horários preferenciais
  priority: number; // Prioridade (1-5, maior = mais importante)
}

export interface TimeSlot {
  start: string; // HH:MM
  end: string; // HH:MM
  weight: number; // Peso (1-10, maior = mais preferido)
}

/**
 * Configuração de Categorias
 */
export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  // ==================== EDUCACIONAL ====================
  educational_clip: {
    name: 'Educacional',
    minDurationMinutes: 3,
    maxDurationMinutes: 15,
    dailyCount: 12, // ~12 clipes educativos por dia
    preferredTimeSlots: [
      { start: '07:00', end: '09:00', weight: 10 }, // Manhã cedo - melhor momento
      { start: '09:00', end: '11:00', weight: 8 },
      { start: '14:00', end: '16:00', weight: 7 }, // Tarde
      { start: '16:00', end: '18:00', weight: 5 },
    ],
    priority: 5, // Máxima prioridade
  },

  // ==================== DESENHOS ====================
  cartoon: {
    name: 'Desenhos',
    minDurationMinutes: 5,
    maxDurationMinutes: 25,
    dailyCount: 15, // ~15 episódios por dia
    preferredTimeSlots: [
      { start: '07:00', end: '12:00', weight: 9 }, // Manhã toda
      { start: '12:00', end: '14:00', weight: 6 }, // Pós-almoço
      { start: '17:00', end: '20:00', weight: 8 }, // Noite
    ],
    priority: 4,
  },

  // ==================== COMERCIAIS ====================
  commercial: {
    name: 'Comercial',
    minDurationMinutes: 0.5,
    maxDurationMinutes: 2,
    dailyCount: 20, // ~20 comerciais por dia (incluindo anúncios de filmes)
    preferredTimeSlots: [
      { start: '07:00', end: '20:00', weight: 5 }, // Distribuído ao longo do dia
    ],
    priority: 2, // Baixa prioridade (preenche os intervalos)
  },

  // ==================== FILMES ====================
  movie: {
    name: 'Filme',
    minDurationMinutes: 45,
    maxDurationMinutes: 120,
    dailyCount: 0, // Filmes são agendados manualmente
    preferredTimeSlots: [
      { start: '14:00', end: '16:00', weight: 10 }, // Tarde (melhor horário)
      { start: '18:00', end: '20:00', weight: 8 }, // Noite
    ],
    priority: 3,
  },
};

/**
 * Configuração de Horários de Funcionamento
 */
export const BROADCAST_CONFIG = {
  startTime: '07:00', // Início da transmissão
  endTime: '20:00', // Fim da transmissão
  commercialIntervalMinutes: 10, // Comercial a cada 10 minutos
  maxConsecutiveSameShow: 2, // Máximo de episódios seguidos do mesmo desenho
};

/**
 * Configuração de Anúncios de Filmes
 */
export const MOVIE_ANNOUNCEMENT_CONFIG = {
  daysBeforeAnnouncement: 5, // Começar a anunciar 5 dias antes
  announcementsPerDay: 5, // 5 anúncios por dia
  announcementDuration: 15, // 15 segundos cada anúncio
  soundEffect: '/sounds/movie-announcement.mp3', // Som do anúncio
};

/**
 * Regras de Distribuição
 */
export const DISTRIBUTION_RULES = {
  // Evitar repetir o mesmo vídeo em X dias
  minDaysBetweenRepeats: 7,
  
  // Respeitar ordem dos episódios (ex: Bluey 001, 002, 003...)
  respectEpisodeOrder: true,
  
  // Balancear diferentes shows (não só Bluey o dia todo)
  balanceShows: true,
  
  // Máximo de minutos do mesmo show por dia
  maxMinutesPerShowPerDay: 60,
  
  // Variedade: tentar incluir diferentes shows em cada bloco de 2 horas
  varietyWindowMinutes: 120,
};

/**
 * Configuração de Filmes Agendados
 * Adicione filmes aqui para gerar anúncios automáticos
 */
export interface ScheduledMovie {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // minutos
  thumbnail?: string;
  description?: string;
}

export const SCHEDULED_MOVIES: ScheduledMovie[] = [
  // Exemplo:
  // {
  //   id: 'movie-aventureiro',
  //   title: 'O Aventureiro',
  //   date: '2025-11-04',
  //   time: '18:00',
  //   duration: 90,
  //   thumbnail: '/images/aventureiro-thumb.jpg',
  //   description: 'Uma aventura emocionante para toda a família!',
  // },
];

/**
 * Função auxiliar para converter HH:MM em minutos desde meia-noite
 */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Função auxiliar para verificar se um horário está dentro de um slot
 */
export function isTimeInSlot(time: string, slot: TimeSlot): boolean {
  const timeMin = timeToMinutes(time);
  const startMin = timeToMinutes(slot.start);
  const endMin = timeToMinutes(slot.end);
  return timeMin >= startMin && timeMin < endMin;
}

/**
 * Função auxiliar para calcular o peso de um horário para uma categoria
 */
export function getTimeSlotWeight(time: string, category: string): number {
  const config = CATEGORY_CONFIG[category];
  if (!config) return 1;

  for (const slot of config.preferredTimeSlots) {
    if (isTimeInSlot(time, slot)) {
      return slot.weight;
    }
  }
  return 1; // Peso padrão fora dos slots preferenciais
}

