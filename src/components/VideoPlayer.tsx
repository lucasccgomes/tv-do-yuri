'use client';

import { Video } from '@/types';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { addViewingTime, saveVideoProgress } from '@/lib/settingsManager';
import { Clock, Loader2, Lock } from 'lucide-react';

export interface VideoPlayerProps {
  video: Video;
  isPlaying: boolean;
  initialTime: number;
  onEnded: () => void;
  onProgress: (time: number) => void;
  segmentStartAt?: number;
  segmentEndAt?: number;
  blocked?: boolean;
}

export function VideoPlayer({
  video,
  isPlaying,
  onEnded,
  initialTime,
  onProgress,
  segmentStartAt = 0,
  segmentEndAt = video.duration,
  blocked = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef(0);
  const lastTimeUpdateRef = useRef(0);
  const [ready, setReady] = useState(false);
  const endFiredRef = useRef(false);
  const lastVideoIdRef = useRef<string | null>(null); // NOVO: rastreia mudança de vídeo

  // CORREÇÃO: Carrega source e posiciona no tempo inicial
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !video) {
      setReady(false);
      return () => {}; // Função de limpeza
    }

    const isNewVideo = lastVideoIdRef.current !== video.id;

    if (isNewVideo) {
      setReady(false);
      lastVideoIdRef.current = video.id;
      endFiredRef.current = false;
      lastTimeRef.current = 0;
      lastTimeUpdateRef.current = Date.now();

      el.src = video.url;
      el.load();

      const onLoadedMetadata = () => {
        el.currentTime = initialTime;
        setReady(true);
        console.log('✅ VideoPlayer: Metadados carregados. Posicionando em:', initialTime);
      };

      const onError = () => {
        console.error('❌ VideoPlayer: Erro ao carregar o vídeo:', video.url);
        // Tenta avançar para o próximo programa
        onEnded();
      };

      el.addEventListener('loadedmetadata', onLoadedMetadata);
      el.addEventListener('error', onError);

      return () => {
        el.removeEventListener('loadedmetadata', onLoadedMetadata);
        el.removeEventListener('error', onError);
      };
    } else {
      // Mesmo vídeo, mas pode ter mudado o initialTime (ex: ao reabrir)
      if (ready && Math.abs(el.currentTime - initialTime) > 2) {
        console.log('⏩ VideoPlayer: Ajustando posição para', initialTime);
        el.currentTime = initialTime;
      }
      return () => {}; // Adicionado: Retorna a função de limpeza vazia
    }
  }, [video?.id, video?.url, initialTime, segmentStartAt, isPlaying, blocked, ready]);


  // Controla play/pause externo
  useEffect(() => {
    const el = videoRef.current;
    if (el && ready && !blocked) {
      if (isPlaying) {
        el.play().catch(e => console.error('Erro ao tentar dar play:', e));
      } else {
        el.pause();
      }
    }
  }, [isPlaying, ready, blocked]);

  // Função de loop para controle de tempo
  const tick = useCallback(() => {
    const el = videoRef.current;
    if (!el || !ready || blocked) return;

    const now = Date.now();
    const currentTime = el.currentTime;

    // 1. Controle de Fim de Segmento/Vídeo
    if (currentTime >= segmentEndAt && !endFiredRef.current) {
      console.log('🏁 Fim de segmento/vídeo atingido:', currentTime, '>=', segmentEndAt);
      endFiredRef.current = true;
      el.pause();
      onEnded();
      return;
    }

    // 2. Controle de Progresso (para salvar)
    // Salva o progresso a cada 1 segundo (ou se o vídeo mudou muito)
    if (Math.abs(currentTime - lastTimeRef.current) >= 1 || now - lastTimeUpdateRef.current > 1000) {
      onProgress(currentTime);
      lastTimeRef.current = currentTime;
      lastTimeUpdateRef.current = now;

      // Salva o progresso para retomada (se não for anúncio)
      if (!video.id.startsWith('announcement-')) {
        saveVideoProgress(video.id, currentTime);
      }

      // Acumula tempo assistido para limite diário
      const deltaSeconds = (now - lastTimeUpdateRef.current) / 1000;
      if (isPlaying && deltaSeconds > 0) {
        addViewingTime(video.id, deltaSeconds);
      }
    }

    // 3. Controle de Início de Segmento
    if (currentTime < segmentStartAt) {
      console.log('⏪ VideoPlayer: Voltando para o início do segmento:', segmentStartAt);
      el.currentTime = segmentStartAt;
    }

    // 4. Loop de Animação
    animationRef.current = requestAnimationFrame(tick);
  }, [ready, blocked, onEnded, onProgress, segmentEndAt, segmentStartAt, isPlaying, video.id]);

  // Inicia/Para o loop de animação
  useEffect(() => {
    if (isPlaying && ready && !blocked) {
      animationRef.current = requestAnimationFrame(tick);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, ready, blocked, tick]);

  if (blocked) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full bg-gray-900 flex flex-col items-center justify-center p-8"
      >
        <Lock className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Conteúdo Bloqueado</h2>
        <p className="text-gray-400 text-center">
          O limite de tempo diário foi atingido ou o controle parental está ativo.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-full bg-black flex items-center justify-center"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        autoPlay={isPlaying}
        muted={false} // Mantenha false para permitir o som
        onContextMenu={(e) => e.preventDefault()} // Desabilita menu de contexto
      />
      {!ready && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
        </div>
      )}
    </motion.div>
  );
}
