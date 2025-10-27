import React, { useRef, useEffect, useState } from 'react';
import { Video } from '@/types';
import { Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoPlayerProps {
  video: Video | null;
  isPlaying: boolean;

  onVideoEnd: () => void;          // chamado quando termina (natural) ou bate no segmentEndAt
  initialTime: number;             // progresso inicial (segundos)
  onProgress: (time: number) => void;
  segmentStartAt?: number;         // início do recorte do vídeo (opcional)
  segmentEndAt?: number;           // fim do recorte (ex.: 10 min)
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
  blocked = false, // default
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [muted, setMuted] = useState(true); // autoplay-friendly
  const [volume, setVolume] = useState(1);
  const [userInteracted, setUserInteracted] = useState(false); // para habilitar som após gesto
  const [ready, setReady] = useState(false);
  const endFiredRef = useRef(false); // evitar disparos múltiplos

  // Carrega source e posiciona no tempo inicial/segmento
  useEffect(() => {
    endFiredRef.current = false;
    const el = videoRef.current;
    if (!el || !video) return;

    // carregar nova midia
    el.src = video.url;
    el.preload = 'metadata';
    el.muted = true;          // necessário para autoplay
    el.playsInline = true as any; // iOS inline
    el.currentTime = Math.max(segmentStartAt ?? 0, initialTime ?? 0);

    const onLoaded = async () => {
      setReady(true);
      // respeitar segmento
      if (segmentStartAt && el.currentTime < segmentStartAt) {
        el.currentTime = segmentStartAt;
      }
      if (isPlaying) {
        try {
          await el.play();
        } catch {
          // navegador bloqueou; aguardamos gesto do usuário
        }
      }
    };

    el.addEventListener('loadedmetadata', onLoaded);
    return () => {
      el.removeEventListener('loadedmetadata', onLoaded);
      setReady(false);
    };
  }, [video?.id, segmentStartAt]); // troca quando muda o vídeo/segmento

  // Controla play/pause externo
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !ready) return;

    (async () => {
      if (isPlaying) {
        try {
          await el.play();
        } catch {
          // provavelmente bloqueou por estar desmutado/sem gesto; mantemos muted até interação
        }
      } else {
        el.pause();
      }
    })();
  }, [isPlaying, ready]);

  // Loop de progresso + corte por segmentEndAt
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const tick = () => {
      const t = el.currentTime || 0;
      onProgress(t);

      // se houver segmentEndAt, corta ali e avança
      if (
        typeof segmentEndAt === 'number' &&
        segmentEndAt > 0 &&
        t >= segmentEndAt - 0.25 && // margem
        !endFiredRef.current
      ) {
        endFiredRef.current = true;
        // pausa para evitar “vazamento” de áudio entre trocas
        el.pause();
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
  }, [segmentEndAt, onProgress, onVideoEnd]);

  // Avançar ao terminar “naturalmente”
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const handleEnded = () => {
      if (!endFiredRef.current) {
        endFiredRef.current = true;
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
    } catch {
      // em último caso o usuário clica no botão play do navegador
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
      await el.requestFullscreen().catch(() => { });
    } else {
      await document.exitFullscreen().catch(() => { });
    }
  };

  return (
    <motion.div className="relative w-full overflow-hidden rounded-xl">
      <video
        ref={videoRef}
        className="w-full h-auto bg-black rounded-xl"
        controls={false}
        playsInline
        crossOrigin="anonymous"
        // autoplay é controlado via effect; manter atributo ajuda em alguns browsers
        autoPlay
      />
      {/* Overlay para destravar som no primeiro clique */}
      {ready && muted && !userInteracted && (
        <button
          onClick={handleUserInteract}
          className="absolute inset-0 grid place-items-center bg-black/40 text-white text-sm"
          aria-label="Toque para ativar o som"
        >
          <span className="px-3 py-2 bg-white/10 rounded-lg">Toque para ativar o som</span>
        </button>
      )}

      {/* === NOVO: overlay de bloqueio por limite diário === */}
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
    </motion.div>
  );
}
