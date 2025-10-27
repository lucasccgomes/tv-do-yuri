'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Video } from '@/types';
import { allVideos } from '@/lib/mockData';
import { weeklySchedule, ScheduledProgram, getTodaySchedule, getNextProgram } from '@/lib/gradeSemanal';
import {
  getSettings,
  isDailyLimitReached,
  addViewingTime,
} from '@/lib/settingsManager';

export interface UseTVState {
  currentVideo: Video | null;
  currentVideoProgress: number;
  isPlaying: boolean;
  dailyLimitReached: boolean;
  segmentStartAt?: number;
  segmentEndAt?: number;
  currentProgram: ScheduledProgram | null;
  nextProgram: ScheduledProgram | null;
  todaySchedule: ScheduledProgram[];
  isOffAir: boolean;
}

export interface UseTVActions {
  play: () => void;
  pause: () => void;
  restart: () => void;
  reportVideoProgress: (time: number) => void;
}

/**
 * Função auxiliar para encontrar o programa atual com base no horário
 * CORREÇÃO: Agora pula programas que já terminaram
 */
function getCurrentProgram(now: Date): {
  program: ScheduledProgram | null;
  elapsedSeconds: number;
} {
  const dayOfWeek = now.getDay();
  const scheduleForToday = weeklySchedule[dayOfWeek];

  if (!scheduleForToday || scheduleForToday.length === 0) {
    return { program: null, elapsedSeconds: 0 };
  }

  const currentTimeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  // Encontra o último programa que já começou E ainda não terminou
  let currentProgram: ScheduledProgram | null = null;
  let programStartTimeInSeconds = 0;

  for (let i = 0; i < scheduleForToday.length; i++) {
    const program = scheduleForToday[i];
    const [h, m, s] = program.time.split(':').map(Number);
    const programTime = h * 3600 + m * 60 + s;

    if (programTime <= currentTimeInSeconds) {
      // Verifica se o programa ainda está no ar
      const videoData = allVideos.find((v) => v.id === program.videoId);
      if (videoData) {
        const blockStartAt = program.startAt || 0;
        const blockEndAt = program.endAt || videoData.duration;
        const programDuration = blockEndAt - blockStartAt;
        const programEndTime = programTime + programDuration;

        // Se o programa ainda não terminou, é o atual
        if (currentTimeInSeconds < programEndTime) {
          currentProgram = program;
          programStartTimeInSeconds = programTime;
        }
        // Se terminou, continua procurando o próximo
      }
    } else {
      break; // Já passou dos programas que começaram
    }
  }

  if (!currentProgram) {
    return { program: null, elapsedSeconds: 0 };
  }

  // Calcula quanto tempo passou desde o início do programa
  const elapsedSeconds = currentTimeInSeconds - programStartTimeInSeconds;

  return { program: currentProgram, elapsedSeconds };
}

/**
 * Hook principal para gerenciar a "TV ao vivo"
 */
export function useTV(): UseTVState & UseTVActions {
  const settingsRef = useRef(getSettings());

  // Estados principais
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [currentVideoProgress, setCurrentVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [dailyLimitReachedState, setDailyLimitReachedState] = useState(false);
  const [segmentStartAt, setSegmentStartAt] = useState<number | undefined>(undefined);
  const [segmentEndAt, setSegmentEndAt] = useState<number | undefined>(undefined);
  const [currentProgram, setCurrentProgram] = useState<ScheduledProgram | null>(null);
  const [nextProgram, setNextProgram] = useState<ScheduledProgram | null>(null);
  const [todaySchedule, setTodaySchedule] = useState<ScheduledProgram[]>([]);
  const [isOffAir, setIsOffAir] = useState(false);

  // Refs para otimização
  const lastUiUpdateRef = useRef(0);
  const lastCountedSecondRef = useRef(0);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastProgramIdRef = useRef<string | null>(null);

  /**
   * Atualiza o programa atual baseado no horário
   */
  const updateCurrentProgram = useCallback(() => {
    const now = new Date();
    const { program, elapsedSeconds } = getCurrentProgram(now);

    // Atualiza a grade do dia
    setTodaySchedule(getTodaySchedule());
    setNextProgram(getNextProgram(now));

    if (!program) {
      // Fora do ar
      console.log('🚫 useTV: Fora do ar');
      setIsOffAir(true);
      setCurrentVideo(null);
      setCurrentProgram(null);
      setIsPlaying(false);
      lastProgramIdRef.current = null;
      return;
    }

    setIsOffAir(false);
    setCurrentProgram(program);

    // Busca o vídeo correspondente
    const videoData = allVideos.find((v) => v.id === program.videoId);

    if (!videoData) {
      console.error(`❌ useTV: Vídeo não encontrado: ${program.videoId}`);
      return;
    }

    // Calcula o ponto de início e fim do segmento
    const blockStartAt = program.startAt || 0;
    const blockEndAt = program.endAt || videoData.duration;

    // Calcula onde o vídeo deveria estar agora
    const currentPosition = blockStartAt + elapsedSeconds;

    // Cria um ID único para o programa
    const programId = `${program.videoId}-${blockStartAt}-${blockEndAt}`;
    const programChanged = lastProgramIdRef.current !== programId;

    if (programChanged) {
      console.log('🎬 useTV: Mudando para:', program.title || videoData.title, 'em', currentPosition, 's');
      
      lastProgramIdRef.current = programId;
      setCurrentVideo(videoData);
      setSegmentStartAt(blockStartAt);
      setSegmentEndAt(blockEndAt);
      setCurrentVideoProgress(currentPosition);
      lastCountedSecondRef.current = Math.floor(currentPosition);

      // Verifica limite diário
      const s = settingsRef.current;
      const reached = isDailyLimitReached();
      setDailyLimitReachedState(reached);

      if (reached && s.enabledParentalControls) {
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
      }
    }
  }, []);

  /**
   * Inicializa e mantém a atualização periódica
   */
  useEffect(() => {
    // Primeira atualização imediata
    updateCurrentProgram();

    // Atualiza a cada 3 segundos (reduzido para detectar mudanças mais rápido)
    updateIntervalRef.current = setInterval(() => {
      updateCurrentProgram();
    }, 3000);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [updateCurrentProgram]);

  /**
   * Controles de reprodução
   */
  const play = useCallback(() => {
    const s = settingsRef.current;
    const reached = isDailyLimitReached();
    if (reached && s.enabledParentalControls) {
      setDailyLimitReachedState(true);
      setIsPlaying(false);
      return;
    }
    setDailyLimitReachedState(false);
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const restart = useCallback(() => {
    lastProgramIdRef.current = null;
    updateCurrentProgram();
    setIsPlaying(true);
  }, [updateCurrentProgram]);

  /**
   * Recebe atualizações de progresso do VideoPlayer
   */
  const reportVideoProgress = useCallback(
    (time: number) => {
      if (!currentVideo) return;

      const start = segmentStartAt ?? 0;
      const end = segmentEndAt ?? currentVideo.duration;

      const clamped = Math.min(Math.max(time, start), end);

      const now = performance.now();
      if (now - lastUiUpdateRef.current >= 1000) {
        setCurrentVideoProgress(clamped);
        lastUiUpdateRef.current = now;
      }

      const sec = Math.floor(clamped);
      if (isPlaying && sec > lastCountedSecondRef.current) {
        const delta = sec - lastCountedSecondRef.current;
        if (delta > 0 && delta < 10) {
          addViewingTime(currentVideo.id, delta);
          lastCountedSecondRef.current = sec;

          const s = settingsRef.current;
          if (isDailyLimitReached() && s.enabledParentalControls) {
            setDailyLimitReachedState(true);
            setIsPlaying(false);
          }
        }
      }

      // Quando atingir o fim do segmento, força atualização
      if (clamped >= end - 0.5) {
        console.log('📺 useTV: Fim do segmento, atualizando...');
        lastProgramIdRef.current = null;
        updateCurrentProgram();
      }
    },
    [currentVideo, segmentStartAt, segmentEndAt, isPlaying, updateCurrentProgram]
  );

  return {
    currentVideo,
    currentVideoProgress,
    isPlaying,
    dailyLimitReached: dailyLimitReachedState,
    segmentStartAt,
    segmentEndAt,
    currentProgram,
    nextProgram,
    todaySchedule,
    isOffAir,
    play,
    pause,
    restart,
    reportVideoProgress,
  };
}

