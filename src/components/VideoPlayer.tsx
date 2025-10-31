'use client';

import { Video } from '@/types';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { saveVideoProgress } from '@/lib/settingsManager';
import { Loader2 } from 'lucide-react';
import { getVideoSrc } from '@/lib/videoUrl';


export interface VideoPlayerProps {
  video: Video;
  isPlaying: boolean;
  initialTime: number;
  onEnded: () => void;
  onProgress: (time: number) => void;
  segmentStartAt?: number;
  segmentEndAt?: number;
}

export function VideoPlayer({
  video,
  isPlaying,
  onEnded,
  initialTime,
  onProgress,
  segmentStartAt = 0,
  segmentEndAt = video.duration,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef(0);
  const lastTimeUpdateRef = useRef(0);
  const [ready, setReady] = useState(false);
  const endFiredRef = useRef(false);
  const lastVideoIdRef = useRef<string | null>(null);

  // Carrega source e posiciona no tempo inicial
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !video) {
      setReady(false);
      return () => { };
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
        onEnded();
      };

      el.addEventListener('loadedmetadata', onLoadedMetadata);
      el.addEventListener('error', onError);

      return () => {
        el.removeEventListener('loadedmetadata', onLoadedMetadata);
        el.removeEventListener('error', onError);
      };
    } else {
      if (ready && Math.abs(el.currentTime - initialTime) > 2) {
        console.log('⏩ VideoPlayer: Ajustando posição para', initialTime);
        el.currentTime = initialTime;
      }
      return () => { };
    }
  }, [video?.id, video?.url, initialTime, segmentStartAt, isPlaying, ready]);

  // Controla play/pause externo
  useEffect(() => {
    const el = videoRef.current;
    if (el && ready) {
      if (isPlaying) {
        el.play().catch(e => console.error('Erro ao tentar dar play:', e));
      } else {
        el.pause();
      }
    }
  }, [isPlaying, ready]);

  // Loop de tempo/progresso
  const tick = useCallback(() => {
    const el = videoRef.current;
    if (!el || !ready) return;

    const now = Date.now();
    const currentTime = el.currentTime;

    // 1) Fim de segmento/vídeo
    if (currentTime >= segmentEndAt && !endFiredRef.current) {
      console.log('🏁 Fim de segmento/vídeo atingido:', currentTime, '>=', segmentEndAt);
      endFiredRef.current = true;
      el.pause();
      onEnded();
      return;
    }

    // 2) Progresso — salva a cada ~1s
    if (Math.abs(currentTime - lastTimeRef.current) >= 1 || now - lastTimeUpdateRef.current > 1000) {
      onProgress(currentTime);

      if (!video.id.startsWith('announcement-')) {
        saveVideoProgress(video.id, currentTime);
      }

      lastTimeRef.current = currentTime;
      lastTimeUpdateRef.current = now;
    }

    // 3) Início de segmento
    if (currentTime < segmentStartAt) {
      console.log('⏪ VideoPlayer: Voltando para o início do segmento:', segmentStartAt);
      el.currentTime = segmentStartAt;
    }

    // 4) Loop
    animationRef.current = requestAnimationFrame(tick);
  }, [ready, onEnded, onProgress, segmentEndAt, segmentStartAt, video.id]);

  // Inicia/Para o loop
  useEffect(() => {
    if (isPlaying && ready) {
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
  }, [isPlaying, ready, tick]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-full bg-black flex items-center justify-center"
    >
      <video
        ref={videoRef}
        src={src}
        controls
        autoPlay
        playsInline
        // muted={false} // se quiser iniciar com áudio
        onLoadedMetadata={(e) => {
          console.log('[player] loadedmetadata', { duration: (e.target as HTMLVideoElement).duration, src });
        }}
        onCanPlay={() => console.log('[player] canplay', { src })}
        onPlaying={() => console.log('[player] playing', { src })}
        onPause={() => console.log('[player] pause', { src })}
        onWaiting={() => console.log('[player] waiting', { src })}
        onStalled={() => console.log('[player] stalled', { src })}
        onError={(e) => {
          const el = e.target as HTMLVideoElement;
          const err = el.error;
          console.error('[player] error', { code: err?.code, message: err?.message, src });
        }}
        className="w-full h-auto rounded-xl bg-black"
      />

      {!ready && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      )}
    </motion.div>
  );
}
