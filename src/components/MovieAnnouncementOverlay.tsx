import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Calendar, Clock } from 'lucide-react';
import { MovieAnnouncement, getAnnouncementDisplayData } from '@/lib/movieAnnouncements';

interface MovieAnnouncementOverlayProps {
  announcement: MovieAnnouncement;
  onComplete: () => void;
}

export function MovieAnnouncementOverlay({ announcement, onComplete }: MovieAnnouncementOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const data = getAnnouncementDisplayData(announcement);
  
  useEffect(() => {
    // Toca o som de anúncio
    if (data.soundEffect) {
      audioRef.current = new Audio(data.soundEffect);
      audioRef.current.play().catch(err => {
        console.warn('Não foi possível tocar o som do anúncio:', err);
      });
    }
    
    // Usa Web Speech API para ler o anúncio (se disponível)
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(data.speech);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
    
    // Remove o anúncio após a duração configurada
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Aguarda animação de saída
    }, data.duration);
    
    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [announcement, data, onComplete]);
  
  const plural = announcement.daysUntilMovie > 1 ? 'DIAS' : 'DIA';
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: -50 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative max-w-2xl w-full mx-4"
          >
            {/* Brilho animado de fundo */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 blur-3xl opacity-50"
            />
            
            {/* Card principal */}
            <div className="relative bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 rounded-3xl p-8 shadow-2xl border-4 border-yellow-400">
              {/* Ícone de filme animado */}
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="flex justify-center mb-6"
              >
                <div className="bg-yellow-400 rounded-full p-6 shadow-lg">
                  <Film size={64} className="text-purple-900" />
                </div>
              </motion.div>
              
              {/* Título "TEM FILME!" */}
              <motion.h1
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-6xl font-black text-center text-yellow-400 mb-4 drop-shadow-lg"
                style={{
                  textShadow: '0 0 20px rgba(251, 191, 36, 0.5), 0 0 40px rgba(251, 191, 36, 0.3)',
                }}
              >
                🎬 TEM FILME! 🎬
              </motion.h1>
              
              {/* Nome do filme */}
              <h2 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">
                {announcement.movieTitle.toUpperCase()}
              </h2>
              
              {/* Thumbnail do filme (se disponível) */}
              {data.thumbnail && (
                <div className="mb-6 rounded-xl overflow-hidden shadow-xl">
                  <img
                    src={data.thumbnail}
                    alt={announcement.movieTitle}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              
              {/* Informações de data e hora */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <p className="text-2xl font-bold text-center text-white mb-4">
                  PROGRAMADO PARA
                </p>
                
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Calendar size={32} />
                    <span className="text-2xl font-bold">{announcement.movieDate}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Clock size={32} />
                    <span className="text-2xl font-bold">{announcement.movieTime}</span>
                  </div>
                </div>
              </div>
              
              {/* Contagem regressiva */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-center"
              >
                <p className="text-5xl font-black text-purple-900 drop-shadow-lg">
                  FALTAM {announcement.daysUntilMovie} {plural}!
                </p>
              </motion.div>
              
              {/* Estrelas decorativas */}
              <div className="absolute top-4 left-4 text-yellow-400 text-4xl animate-pulse">⭐</div>
              <div className="absolute top-4 right-4 text-yellow-400 text-4xl animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
              <div className="absolute bottom-4 left-4 text-yellow-400 text-4xl animate-pulse" style={{ animationDelay: '1s' }}>⭐</div>
              <div className="absolute bottom-4 right-4 text-yellow-400 text-4xl animate-pulse" style={{ animationDelay: '1.5s' }}>⭐</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook para gerenciar anúncios de filmes
 */
export function useMovieAnnouncements() {
  const [currentAnnouncement, setCurrentAnnouncement] = useState<MovieAnnouncement | null>(null);
  
  const showAnnouncement = (announcement: MovieAnnouncement) => {
    setCurrentAnnouncement(announcement);
  };
  
  const hideAnnouncement = () => {
    setCurrentAnnouncement(null);
  };
  
  return {
    currentAnnouncement,
    showAnnouncement,
    hideAnnouncement,
  };
}

