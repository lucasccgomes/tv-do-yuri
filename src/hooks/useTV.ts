import { useState, useEffect, useCallback, useRef } from 'react';
import { Video } from '@/types';
import { loadAllVideosFromNextcloud } from '@/lib/nextcloudVideoLoader';
import { generateWeekSchedule, ScheduledProgram } from '@/lib/scheduleGenerator';
import { markEpisodeAsPlayed } from '@/lib/episodeTracker';
import { getTodayMovieAnnouncements } from '@/lib/movieAnnouncements';
import { BROADCAST_CONFIG } from '@/lib/programmingConfig';
import { SCHEDULED_MOVIES } from '@/lib/programmingConfig';

interface TVState {
  video: Video | null;
  currentVideoProgress: number;
  playlist: ScheduledProgram[];
  currentProgramIndex: number;
  isOnAir: boolean;
  nextProgram: ScheduledProgram | null;
  currentProgram: ScheduledProgram | null;
  allVideos: Video[];
}

export function useTV() {
  const [state, setState] = useState<TVState>({
    allVideos: [],
    video: null,
    currentVideoProgress: 0,
    playlist: [],
    currentProgramIndex: -1,
    isOnAir: false,
    nextProgram: null,
    currentProgram: null,
  });

  const [weekSchedule, setWeekSchedule] = useState<Record<number, ScheduledProgram[]>>({});

  const lastProgramIdRef = useRef<string | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Converte HH:MM:SS em segundos desde meia-noite
   */
  const timeToSeconds = useCallback((time: string): number => {
    const [h, m, s] = time.split(':').map(Number);
    return h * 3600 + m * 60 + s;
  }, []);

  /**
   * Carrega vídeos e gera a grade da semana
   */
  const generateSchedule = useCallback(async () => {
    console.log('🔄 Carregando vídeos e gerando grade semanal automática...');
    
    try {
      // 1. Carrega vídeos do Nextcloud
      const loadedVideos = await loadAllVideosFromNextcloud();
      
      setState(prev => ({
        ...prev,
        allVideos: loadedVideos,
      }));
      
      // 2. Adiciona anúncios de filmes aos vídeos disponíveis
      const movieAnnouncements = getTodayMovieAnnouncements(SCHEDULED_MOVIES);
      const allAvailableVideos = [...loadedVideos, ...movieAnnouncements];
      
      // 3. Gera grade da semana
      const schedule = generateWeekSchedule(allAvailableVideos);
      setWeekSchedule(schedule);
      
      console.log('✅ Grade semanal gerada:', {
        videosCarregados: loadedVideos.length,
        anunciosGerados: movieAnnouncements.length,
        totalProgramas: Object.values(schedule).reduce((acc, day) => acc + day.length, 0),
      });
    } catch (error) {
      console.error('❌ Erro ao gerar grade:', error);
    }
  }, []);
  
  /**
   * Atualiza o programa atual baseado no horário
   */
  const updateCurrentProgram = useCallback(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentTimeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    console.log('🔄 Atualizando programa...');
    console.log('📅 Dia da semana:', dayOfWeek, '(0=Dom, 1=Seg, etc)');

    // Obtém programação do dia
    const scheduleForToday = weekSchedule[dayOfWeek];

    if (!scheduleForToday || scheduleForToday.length === 0) {
      console.warn('⚠️ Nenhum programa agendado para hoje!');
      setState(prev => ({
        ...prev,
        video: null,
        isOnAir: false,
        currentProgram: null,
        nextProgram: null,
        playlist: [],
      }));
      return;
    }

    console.log('📋 Programas hoje:', scheduleForToday.length);
    console.log('🕐 Horário atual:', `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`, `(${currentTimeInSeconds}s)`);

    // Encontra o programa atual
    let currentProgram: ScheduledProgram | null = null;
    let programStartTimeInSeconds = 0;
    let currentProgramIndex = -1;

    for (let i = 0; i < scheduleForToday.length; i++) {
      const program = scheduleForToday[i];
      const programTime = timeToSeconds(program.time);
      
      // Busca o vídeo correspondente
      const videoData = state.allVideos.find(v => v.id === program.videoId);
      if (!videoData) {
        console.warn(`⚠️ Vídeo não encontrado: ${program.videoId}`);
        continue;
      }

      // Se o programa tiver endAt, usa a duração do bloco
      const programDuration = program.endAt && program.startAt 
        ? program.endAt - program.startAt
        : videoData.duration;
        
      const programEndTime = programTime + programDuration;

      // Se o programa ainda não terminou, é o atual
      if (currentTimeInSeconds >= programTime && currentTimeInSeconds < programEndTime) {
        currentProgram = program;
        programStartTimeInSeconds = programTime;
        currentProgramIndex = i;
        break;
      }
    }

    if (!currentProgram) {
      console.log('🚫 FORA DO AR - Nenhum programa no momento');
      setState(prev => ({
        ...prev,
        video: null,
        isOnAir: false,
        currentProgram: null,
        nextProgram: null,
        playlist: scheduleForToday,
      }));
      return;
    }

    console.log('✅ Programa atual encontrado:', currentProgram.videoId);

    // Busca próximo programa
    const nextProgram = currentProgramIndex >= 0 && currentProgramIndex < scheduleForToday.length - 1
      ? scheduleForToday[currentProgramIndex + 1]
      : null;

    if (nextProgram) {
      console.log('⏭️ Próximo programa:', nextProgram.videoId, 'às', nextProgram.time);
    }

    // Busca dados do vídeo
    const videoData = state.allVideos.find(v => v.id === currentProgram.videoId);
    if (!videoData) {
      console.error('❌ Vídeo não encontrado:', currentProgram.videoId);
      return;
    }

    console.log('✅ Vídeo encontrado:', videoData.title);

    // Calcula tempo decorrido desde o início do programa
    const elapsedSeconds = currentTimeInSeconds - programStartTimeInSeconds;
    console.log('⏱️ Tempo decorrido:', elapsedSeconds, 'segundos');

    // Define segmento (se houver startAt/endAt)
    const blockStartAt = currentProgram.startAt || 0;
    const blockEndAt = currentProgram.endAt || videoData.duration;

    console.log('📐 Segmento:', blockStartAt, 'até', blockEndAt, 'segundos');

    // Calcula posição no vídeo
    const videoPosition = blockStartAt + elapsedSeconds;

    console.log('📍 Posição calculada:', videoPosition, 'segundos');

    // Verifica se o programa já terminou
    if (videoPosition >= blockEndAt) {
      console.log('⏭️ Programa já terminou, avançando para próximo...');
      // Aguarda próximo programa
      setState(prev => ({
        ...prev,
        video: null,
        isOnAir: false,
        currentProgram: null,
        nextProgram,
        playlist: scheduleForToday,
      }));
      return;
    }

    // Cria ID único do programa (inclui blocos)
    const programId = `${currentProgram.videoId}-${blockStartAt}-${blockEndAt}`;
    const programChanged = lastProgramIdRef.current !== programId;

    if (programChanged) {
      console.log('🎬 Mudando para:', videoData.title, 'em', videoPosition, 's');
      lastProgramIdRef.current = programId;

      // Marca episódio como assistido (se não for um anúncio)
      if (!currentProgram.videoId.startsWith('announcement-')) {
        markEpisodeAsPlayed(currentProgram.videoId, Math.ceil(videoData.duration / 60));
      }

      setState(prev => ({
        ...prev,
        video: videoData,
        currentVideoProgress: videoPosition,
        playlist: scheduleForToday,
        currentProgramIndex: currentProgramIndex,
        isOnAir: true,
        nextProgram,
        currentProgram,
      }));
    } else {
      // Apenas atualiza o progresso
      setState(prev => ({
        ...prev,
        currentVideoProgress: videoPosition,
      }));
    }
  }, [weekSchedule, timeToSeconds, state.allVideos]);

  /**
   * Verifica se está no horário de transmissão
   */
  const isInBroadcastTime = useCallback((): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinute;

    const [startH, startM] = BROADCAST_CONFIG.startTime.split(':').map(Number);
    const [endH, endM] = BROADCAST_CONFIG.endTime.split(':').map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    return currentTimeMinutes >= startMinutes && currentTimeMinutes < endMinutes;
  }, []);

  /**
   * Reinicia a programação (útil após mudanças)
   */
  const restart = useCallback(() => {
    console.log('🔄 Reiniciando programação...');
    lastProgramIdRef.current = null;
    generateSchedule();
  }, [generateSchedule]);

  /**
   * Força atualização do programa atual
   */
  const forceUpdate = useCallback(() => {
    updateCurrentProgram();
  }, [updateCurrentProgram]);

  // Gera grade ao montar
  useEffect(() => {
    console.log('🚀 useTV: Inicializando...');
    generateSchedule();
  }, [generateSchedule]);

  // Atualiza programa quando a grade estiver pronta
  useEffect(() => {
    if (Object.keys(weekSchedule).length > 0) {
      console.log('📺 Grade carregada, atualizando programa...');
      updateCurrentProgram();
    }
  }, [weekSchedule, updateCurrentProgram]);

  // Intervalo de atualização
  useEffect(() => {
    if (Object.keys(weekSchedule).length === 0) return;

    console.log('⏰ Iniciando verificação periódica (5s)...');

    updateIntervalRef.current = setInterval(() => {
      console.log('⏰ Verificação periódica...');
      
      if (!isInBroadcastTime()) {
        console.log('🌙 Fora do horário de transmissão');
        setState(prev => ({
          ...prev,
          video: null,
          isOnAir: false,
        }));
        return;
      }

      updateCurrentProgram();
    }, 5000); // A cada 5 segundos

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [weekSchedule, updateCurrentProgram, isInBroadcastTime]);

  return {
    video: state.video,
    currentVideoProgress: state.currentVideoProgress,
    playlist: state.playlist,
    currentProgramIndex: state.currentProgramIndex,
    isOnAir: state.isOnAir,
    nextProgram: state.nextProgram,
    currentProgram: state.currentProgram,
    restart,
    forceUpdate,
    isInBroadcastTime: isInBroadcastTime(),
  };
}
