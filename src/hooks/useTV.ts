'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Video, PlaylistItem, AppSettings } from '@/types';
import { generateDailyPlaylist } from '@/lib/advancedProgrammingRules';
import { allVideos } from '@/lib/mockData';
import {
  getSettings,
  isDailyLimitReached,
  addViewingTime,
  saveVideoProgress,
  getVideoProgress,
} from '@/lib/settingsManager';

export interface UseTVState {
  playlist: PlaylistItem[];
  currentIndex: number;
  isPlaying: boolean;
  currentVideo: Video | null;
  currentVideoProgress: number; // progresso atual (s)
  dailyLimitReached: boolean;
  segmentStartAt?: number;       // início do segmento atual (s)
  segmentEndAt?: number;         // fim do segmento atual (s)
}

export interface UseTVActions {
  play: () => void;
  pause: () => void;
  next: () => void;
  restart: () => void;
  updateSettings: (newSettings: AppSettings) => void;
  reportVideoProgress: (time: number) => void; // chamado pelo VideoPlayer (rAF)
}

export function useTV(): UseTVState & UseTVActions {
  // SETTINGS ficam num ref para leituras rápidas dentro de efeitos/handlers
  const settingsRef = useRef<AppSettings>(getSettings());

  // STATE principal
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // autoplay ON por padrão
  const [currentVideoProgress, setCurrentVideoProgress] = useState(0);
  const [dailyLimitReachedState, setDailyLimitReachedState] = useState(false);

  // Otimizações para throttling de UI / saves
  const lastUiUpdateRef = useRef(0);
  const lastSavedSecondRef = useRef(0);
  const lastCountedSecondRef = useRef(0);

  // (1) Gera playlist do dia ao montar e quando settings mudarem
  const loadDailyPlaylist = useCallback(() => {
    const s = getSettings();
    settingsRef.current = s;

    // Gere quantos itens quiser; aqui deixo 20 como exemplo
    const pl = generateDailyPlaylist(allVideos, s, 20);
    setPlaylist(pl);
    setCurrentIndex(0);
    setCurrentVideoProgress(0);

    // se já atingiu o limite diário, apenas refletir na UI e pausar
    const reached = isDailyLimitReached();
    setDailyLimitReachedState(reached);
    if (reached && s.enabledParentalControls) {
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    loadDailyPlaylist();
  }, [loadDailyPlaylist]);

  // (2) Vídeo atual
  const currentItem = playlist[currentIndex];
  const currentVideo = currentItem?.video ?? null;

  // (3) Cálculo do segmento (start/end) com base nos settings e no item atual
  const { segmentStartAt, segmentEndAt } = useMemo(() => {
    if (!currentItem || !currentVideo) return { segmentStartAt: 0, segmentEndAt: undefined as number | undefined };

    const s = settingsRef.current;

    // ponto inicial: startAt do item OU retomada salva (se permitido), mas nunca antes do startAt
    const baseStart = currentItem.startAt ?? 0;
    const saved = s.allowVideoResumption ? getVideoProgress(currentVideo.id) : undefined;
    const resumeAt =
      typeof saved === 'number'
        ? Math.max(saved, baseStart)
        : typeof saved === 'object' && typeof saved?.position === 'number'
        ? Math.max(saved.position, baseStart)
        : baseStart;

    // limite final do segmento
    let end: number | undefined = currentItem.endAt ?? currentVideo.duration;

    // corta por sessão longa
    if (s.interruptLongVideos && s.maxSessionDuration > 0) {
      const candidate = resumeAt + s.maxSessionDuration * 60;
      end = Math.min(end, candidate, currentVideo.duration);
    }

    // corta por “tempo contínuo por desenho”
    if (s.maxContinuousPerShowMinutes && s.maxContinuousPerShowMinutes > 0) {
      const candidate = resumeAt + s.maxContinuousPerShowMinutes * 60;
      end = Math.min(end, candidate, currentVideo.duration);
    }

    // sanity
    if (typeof end !== 'number' || end <= 0) end = currentVideo.duration;
    if (end < resumeAt) end = Math.min(resumeAt + 5, currentVideo.duration); // garante um pequeno avanço

    return { segmentStartAt: resumeAt, segmentEndAt: end };
  }, [currentItem, currentVideo]);

  // (4) Ao trocar de vídeo, reposiciona progresso inicial (para o VideoPlayer usar como initialTime)
  useEffect(() => {
    if (!currentVideo) return;
    setCurrentVideoProgress(segmentStartAt ?? 0);
    lastSavedSecondRef.current = Math.floor(segmentStartAt ?? 0);
    lastCountedSecondRef.current = Math.floor(segmentStartAt ?? 0);
  }, [currentVideo?.id, segmentStartAt]);

  // (5) Controles básicos
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

  const next = useCallback(() => {
    // salva o progresso no fim do segmento do item atual
    if (currentItem?.video) {
      saveVideoProgress(currentItem.video.id, segmentEndAt ?? currentItem.video.duration);
    }

    setCurrentIndex((prev) => {
      const nxt = prev + 1;
      if (nxt < playlist.length) return nxt;

      // fim da playlist do dia → recria (ou pare; aqui recriamos e continuamos pausado)
      loadDailyPlaylist();
      return 0;
    });
  }, [currentItem?.video, segmentEndAt, playlist.length, loadDailyPlaylist]);

  const restart = useCallback(() => {
    loadDailyPlaylist();
    setIsPlaying(true);
  }, [loadDailyPlaylist]);

  const updateSettings = useCallback(
    (newSettings: AppSettings) => {
      settingsRef.current = newSettings;
      loadDailyPlaylist();
    },
    [loadDailyPlaylist]
  );

  // (6) Progressos vindos do VideoPlayer
  const reportVideoProgress = useCallback(
    (time: number) => {
      if (!currentItem?.video) return;

      const v = currentItem.video;
      const start = segmentStartAt ?? 0;
      const end = segmentEndAt ?? v.duration;

      // clamp dentro do segmento
      const clamped = Math.min(Math.max(time, start), end);

      // throttling de UI: atualiza no máx 1x/seg
      const now = performance.now();
      if (now - lastUiUpdateRef.current >= 1000) {
        setCurrentVideoProgress(clamped);
        lastUiUpdateRef.current = now;
      }

      // contagem de tempo assistido, 1s por segundo (sem duplicar)
      const sec = Math.floor(clamped);
      if (isPlaying && sec > lastCountedSecondRef.current) {
        const delta = sec - lastCountedSecondRef.current;
        if (delta > 0) {
          // contabiliza com o ID do vídeo (segue sua assinatura atual)
          addViewingTime(v.id, delta);
          lastCountedSecondRef.current = sec;

          // checa limite diário
          const s = settingsRef.current;
          if (isDailyLimitReached() && s.enabledParentalControls) {
            setDailyLimitReachedState(true);
            setIsPlaying(false);
          }
        }
      }

      // salvar progresso a cada 10s (sem sobrescrever além do segmento)
      if (sec >= lastSavedSecondRef.current + 10 && sec >= start && sec < end) {
        saveVideoProgress(v.id, sec);
        lastSavedSecondRef.current = sec;
      }

      // disparar avanço quando atingir o fim do segmento
      if (clamped >= end - 0.25) {
        // salva fim do segmento e avança
        saveVideoProgress(v.id, end);
        next();
      }
    },
    [currentItem?.video, segmentStartAt, segmentEndAt, isPlaying, next]
  );

  return {
    // state
    playlist,
    currentIndex,
    isPlaying,
    currentVideo,
    currentVideoProgress,
    dailyLimitReached: dailyLimitReachedState,
    segmentStartAt,
    segmentEndAt,

    // actions
    play,
    pause,
    next,
    restart,
    updateSettings,
    reportVideoProgress,
  };
}
