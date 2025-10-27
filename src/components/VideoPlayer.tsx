import React, { useRef, useEffect, useState } from 'react';
import { Video } from '@/types';
import { Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoPlayerProps {
  video: Video | null;
  isPlaying: boolean;
  onVideoEnd: () => void;
  initialTime: number;
  onProgress: (time: number) => void;
  segmentStartAt?: number;
  segmentEndAt?: number;
  blocked?: boolean;
}

export function VideoPlayer({
  video,
  isPlaying,
  onVideoEnd,
  initialTime,
  onProgress,
  segmentStartAt,
  segmentEndAt,
  blocked = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [userInteracted, setUserInteracted] = useState(false);
  const [ready, setReady] = useState(false);
  const endFiredRef = useRef(false);
  const lastVideoIdRef = useRef<string | null>(null); // NOVO: rastreia mudança de vídeo

  // CORREÇÃO: Carrega source e posiciona no tempo inicial
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !video) {
      setReady(false);
      return;
    }

    // Detecta se é um vídeo novo
    const isNewVideo = lastVideoIdRef.current !== video.id;
    
    if (isNewVideo) {
      console.log('🎬 VideoPlayer: Carregando novo vídeo:', video.title, 'em', initialTime, 'segundos');
      lastVideoIdRef.current = video.id;
      endFiredRef.current = false;
      setReady(false);

      // Carrega nova mídia
      el.src = video.url;
      el.preload = 'metadata';
      el.muted = true; // necessário para autoplay
      el.playsInline = true as any;

      const onLoaded = async () => {
        console.log('📺 VideoPlayer: Metadata carregada, posicionando em', initialTime);
        
        // IMPORTANTE: Define o tempo inicial APÓS carregar metadata
        const startTime = Math.max(segmentStartAt ?? 0, initialTime ?? 0);
        el.currentTime = startTime;
        
        setReady(true);

        // Tenta dar play automaticamente
        if (isPlaying && !blocked) {
          try {
            await el.play();
            console.log('▶️ VideoPlayer: Reprodução iniciada');
          } catch (err) {
            console.warn('⚠️ VideoPlayer: Autoplay bloqueado, aguardando interação do usuário');
          }
        }
      };

      const onError = (e: Event) => {
        console.error('❌ VideoPlayer: Erro ao carregar vídeo:', e);
      };

      el.addEventListener('loadedmetadata', onLoaded);
      el.addEventListener('error', onError);

      return () => {
        el.removeEventListener('loadedmetadata', onLoaded);
        el.removeEventListener('error', onError);
      };
    } else {
      // Mesmo vídeo, mas pode ter mudado o initialTime (ex: ao reabrir)
      if (ready && Math.abs(el.currentTime - initialTime) > 2) {
        console.log('⏩ VideoPlayer: Ajustando posição para', initialTime);
        el.currentTime = initialTime;
      }
    }
  }, [video?.id, video?.url, initialTime, segmentStartAt, isPlaying, blocked, ready]);

  // Controla play/pause externo
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !ready || blocked) return;

    (async () => {
      if (isPlaying) {
        if (el.paused) {
          try {
            await el.play();
            console.log('▶️ VideoPlayer: Play externo');
          } catch (err) {
            console.warn('⚠️ VideoPlayer: Play bloqueado');
          }
        }
      } else {
        if (!el.paused) {
          el.pause();
          console.log('⏸️ VideoPlayer: Pause externo');
        }
      }
    })();
  }, [isPlaying, ready, blocked]);

  // Loop de progresso + corte por segmentEndAt
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !ready) return;

    const tick = () => {
      const t = el.currentTime || 0;
      onProgress(t);

      // se houver segmentEndAt, corta ali e avança
      if (
        typeof segmentEndAt === 'number' &&
        segmentEndAt > 0 &&
        t >= segmentEndAt - 0.25 &&
        !endFiredRef.current
      ) {
        endFiredRef.current = true;
        el.pause();
        console.log('📺 VideoPlayer: Fim do segmento atingido');
        onVideoEnd();
        return;
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    };
  }, [ready, segmentEndAt, onProgress, onVideoEnd]);

  // Avançar ao terminar "naturalmente"
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const handleEnded = () => {
      if (!endFiredRef.current) {
        endFiredRef.current = true;
        console.log('📺 VideoPlayer: Vídeo terminou naturalmente');
        onVideoEnd();
      }
    };
    el.addEventListener('ended', handleEnded);
    return () => el.removeEventListener('ended', handleEnded);
  }, [onVideoEnd]);

  const handleUserInteract = async () => {
    setUserInteracted(true);
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    setMuted(false);
    try {
      await el.play();
      console.log('🔊 VideoPlayer: Som ativado pelo usuário');
    } catch (err) {
      console.warn('⚠️ VideoPlayer: Erro ao ativar som');
    }
  };

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    if (!el.muted) setUserInteracted(true);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = videoRef.current;
    if (!el) return;
    const v = Number(e.target.value);
    setVolume(v);
    el.volume = v;
    if (v > 0 && el.muted) {
      el.muted = false;
      setMuted(false);
      setUserInteracted(true);
    }
  };

  const toggleFullscreen = async () => {
    const el = videoRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen().catch(() => {});
    } else {
      await document.exitFullscreen().catch(() => {});
    }
  };

  // Mensagem quando não há vídeo
  if (!video) {
    return (
      <div className="aspect-video bg-gradient-to-br from-purple-900 to-pink-900 rounded-xl flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-2xl mb-2">📺</p>
          <p className="text-lg">Aguardando programação...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="relative w-full overflow-hidden rounded-xl">
      <video
        ref={videoRef}
        className="w-full h-auto bg-black rounded-xl"
        controls={false}
        playsInline
        crossOrigin="anonymous"
      />
      
      {/* Overlay para destravar som no primeiro clique */}
      {ready && muted && !userInteracted && (
        <button
          onClick={handleUserInteract}
          className="absolute inset-0 grid place-items-center bg-black/40 text-white text-sm hover:bg-black/50 transition-colors"
          aria-label="Toque para ativar o som"
        >
          <span className="px-4 py-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
            🔊 Toque para ativar o som
          </span>
        </button>
      )}

      {/* Overlay de bloqueio por limite diário */}
      {blocked && (
        <div className="absolute inset-0 grid place-items-center bg-black/50">
          <div className="rounded-xl bg-white/95 px-4 py-2 text-center shadow">
            <p className="text-sm font-medium text-neutral-900">
              Tempo de tela de hoje completo
            </p>
            <p className="text-xs text-neutral-600">Faça uma pausa e escolha uma atividade offline.</p>
          </div>
        </div>
      )}

      {/* Barra de controles simples */}
      {ready && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent"
        >
          <div className="flex items-center gap-3 text-white">
            <button onClick={toggleMute} aria-label={muted ? 'Ativar som' : 'Mutar'}>
              {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              className="w-36 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
            />

            <div className="ml-auto">
              <button onClick={toggleFullscreen} aria-label="Tela cheia">
                <Maximize2 size={22} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

