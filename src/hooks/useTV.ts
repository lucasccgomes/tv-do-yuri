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
  currentVideoProgress: number; // progresso atual (s)
  isPlaying: boolean;
  dailyLimitReached: boolean;
  segmentStartAt?: number; // início do segmento atual (s)
  segmentEndAt?: number; // fim do segmento atual (s)
  currentProgram: ScheduledProgram | null; // programa atual da grade
  nextProgram: ScheduledProgram | null; // próximo programa
  todaySchedule: ScheduledProgram[]; // grade completa do dia
  isOffAir: boolean; // se está fora do ar
}

export interface UseTVActions {
  play: () => void;
  pause: () => void;
  restart: () => void;
  reportVideoProgress: (time: number) => void;
}

/**
 * Função auxiliar para encontrar o programa atual com base no horário
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

  // Encontra o último programa que já começou
  let currentProgram: ScheduledProgram | null = null;
  let programStartTimeInSeconds = 0;

  for (let i = 0; i < scheduleForToday.length; i++) {
    const program = scheduleForToday[i];
    const [h, m, s] = program.time.split(':').map(Number);
    const programTime = h * 3600 + m * 60 + s;

    if (programTime <= currentTimeInSeconds) {
      currentProgram = program;
      programStartTimeInSeconds = programTime;
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
  const lastProgramIdRef = useRef<string | null>(null); // NOVO: rastreia mudança de programa

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
      console.error(`Vídeo não encontrado: ${program.videoId}`);
      return;
    }

    // Calcula o ponto de início e fim do segmento
    const blockStartAt = program.startAt || 0;
    const blockEndAt = program.endAt || videoData.duration;

    // Calcula onde o vídeo deveria estar agora (tempo decorrido + início do bloco)
    const currentPosition = blockStartAt + elapsedSeconds;

    // Se já passou do fim do bloco, não toca (aguarda próximo programa)
    if (currentPosition >= blockEndAt) {
      // Programa já terminou, aguarda atualização para o próximo
      return;
    }

    // CORREÇÃO: Cria um ID único para o programa (videoId + startAt + endAt)
    const programId = `${program.videoId}-${blockStartAt}-${blockEndAt}`;
    const programChanged = lastProgramIdRef.current !== programId;

    if (programChanged) {
      console.log('🎬 Mudando para:', program.title || videoData.title, 'às', currentPosition, 'segundos');
      
      lastProgramIdRef.current = programId;
      setCurrentVideo(videoData);
      setSegmentStartAt(blockStartAt);
      setSegmentEndAt(blockEndAt);
      setCurrentVideoProgress(currentPosition); // IMPORTANTE: Define o tempo inicial
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
  }, []); // CORREÇÃO: Remove dependências para evitar loops

  /**
   * Inicializa e mantém a atualização periódica
   */
  useEffect(() => {
    // Primeira atualização imediata
    updateCurrentProgram();

    // Atualiza a cada 5 segundos para verificar mudanças de programa (reduzido de 10s)
    updateIntervalRef.current = setInterval(() => {
      updateCurrentProgram();
    }, 5000);

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
    // Força atualização imediata
    lastProgramIdRef.current = null; // Força recarga do programa atual
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

      // Clamp dentro do segmento
      const clamped = Math.min(Math.max(time, start), end);

      // Throttling de UI: atualiza no máx 1x/seg
      const now = performance.now();
      if (now - lastUiUpdateRef.current >= 1000) {
        setCurrentVideoProgress(clamped);
        lastUiUpdateRef.current = now;
      }

      // Contagem de tempo assistido, 1s por segundo (sem duplicar)
      const sec = Math.floor(clamped);
      if (isPlaying && sec > lastCountedSecondRef.current) {
        const delta = sec - lastCountedSecondRef.current;
        if (delta > 0 && delta < 10) {
          // Sanity check: não conta saltos grandes
          addViewingTime(currentVideo.id, delta);
          lastCountedSecondRef.current = sec;

          // Checa limite diário
          const s = settingsRef.current;
          if (isDailyLimitReached() && s.enabledParentalControls) {
            setDailyLimitReachedState(true);
            setIsPlaying(false);
          }
        }
      }

      // Quando atingir o fim do segmento, força atualização para próximo programa
      if (clamped >= end - 0.5) {
        console.log('📺 Fim do segmento, avançando para próximo programa...');
        lastProgramIdRef.current = null; // Força recarga
        updateCurrentProgram();
      }
    },
    [currentVideo, segmentStartAt, segmentEndAt, isPlaying, updateCurrentProgram]
  );

  return {
    // State
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

    // Actions
    play,
    pause,
    restart,
    reportVideoProgress,
  };
}

