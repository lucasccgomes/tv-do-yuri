'use client';

import { useState, useEffect } from 'react';
import { useTV } from '@/hooks/useTV';
import {VideoPlayer} from '../components/VideoPlayer';
import {Playlist} from '../components/Playlist';
import {SettingsModal} from '../components/SettingsModal';
import { MovieAnnouncementOverlay, useMovieAnnouncements } from '@/components/MovieAnnouncementOverlay';
import { MovieAnnouncement } from '@/lib/movieAnnouncements';
import { Settings, Tv, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const tv = useTV();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const { currentAnnouncement, showAnnouncement, hideAnnouncement } = useMovieAnnouncements();

  // Detecta anúncios de filmes
  useEffect(() => {
    if (tv.currentProgram?.category === 'commercial' && tv.currentProgram.videoId.startsWith('announcement-')) {
      // É um anúncio de filme
      const announcement = tv.video as unknown as MovieAnnouncement;
      if (announcement.movieId) {
        showAnnouncement(announcement);
      }
    }
  }, [tv.currentProgram, tv.video, showAnnouncement]);

  // Formata tempo para exibição
  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Formata duração
  const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <Tv size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white drop-shadow-lg">
                  TV do Yuri
                </h1>
                <p className="text-sm text-purple-200">Canal educativo ao vivo</p>
              </div>
            </div>

            {/* Status e Controles */}
            <div className="flex items-center gap-4">
              {/* Indicador de Status */}
              <div className="flex items-center gap-2">
                {tv.isOnAir && tv.isInBroadcastTime ? (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-3 h-3 bg-red-500 rounded-full"
                    />
                    <span className="text-white font-bold">Ao Vivo</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-gray-500 rounded-full" />
                    <span className="text-gray-400 font-bold">Fora do Ar</span>
                  </>
                )}
              </div>

              {/* Botão Atualizar */}
              <button
                onClick={tv.forceUpdate}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Atualizar programação"
              >
                <RefreshCw size={20} className="text-white" />
              </button>

              {/* Botão Grade */}
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold text-white transition-all shadow-lg"
              >
                Grade
              </button>

              {/* Botão Configurações */}
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Settings size={24} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player de Vídeo */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
              {tv.isOnAir && tv.video ? (
                <VideoPlayer
                  video={tv.video}
                  initialTime={tv.currentVideoProgress}
                  onEnded={tv.forceUpdate}
                />
              ) : (
                <OffAirScreen isInBroadcastTime={tv.isInBroadcastTime} />
              )}
            </div>

            {/* Informações do Programa Atual */}
            {tv.isOnAir && tv.video && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {tv.video.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-purple-200">
                      <span className="px-3 py-1 bg-purple-600/50 rounded-full">
                        {getCategoryName(tv.video.category)}
                      </span>
                      <span>⏱️ {formatDuration(tv.video.duration)}</span>
                      {tv.video.ageRecommendation && (
                        <span>👶 {tv.video.ageRecommendation}</span>
                      )}
                    </div>
                    {tv.video.description && (
                      <p className="mt-3 text-purple-100">{tv.video.description}</p>
                    )}
                  </div>
                </div>

                {/* Próximo Programa */}
                {tv.nextProgram && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-sm text-purple-300 mb-2">📺 A seguir:</p>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold">{tv.nextProgram.time}</span>
                      <span className="text-purple-200">{tv.nextProgram.title || tv.nextProgram.videoId}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Grade de Programação */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                📅 Programação de Hoje
              </h3>
              
              {tv.playlist.length > 0 ? (
                <Playlist
                  programs={tv.playlist}
                  currentIndex={tv.currentProgramIndex}
                />
              ) : (
                <div className="text-center text-purple-300 py-8">
                  <p>Carregando programação...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon="📺"
            label="Programas Hoje"
            value={tv.playlist.length}
          />
          <StatCard
            icon="🎬"
            label="Programa Atual"
            value={tv.currentProgramIndex + 1}
          />
          <StatCard
            icon="⏰"
            label="Status"
            value={tv.isInBroadcastTime ? 'No Ar' : 'Fora do Ar'}
          />
        </div>
      </main>

      {/* Modal de Configurações */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => {
          setShowSettingsModal(false);
          tv.restart();
        }}
      />

      {/* Overlay de Anúncios de Filmes */}
      {currentAnnouncement && (
        <MovieAnnouncementOverlay
          announcement={currentAnnouncement}
          onComplete={hideAnnouncement}
        />
      )}
    </div>
  );
}

/**
 * Tela "Fora do Ar"
 */
function OffAirScreen({ isInBroadcastTime }: { isInBroadcastTime: boolean }) {
  return (
    <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-8">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Tv size={80} className="text-gray-600 mb-6" />
      </motion.div>
      
      <h2 className="text-3xl font-bold text-white mb-4">
        {isInBroadcastTime ? 'Aguardando programação...' : 'Fora do Ar'}
      </h2>
      
      <p className="text-gray-400 text-center max-w-md">
        {isInBroadcastTime
          ? 'Estamos preparando o próximo programa. Aguarde alguns instantes...'
          : 'A TV do Yuri funciona das 07:00 às 20:00. Volte mais tarde!'}
      </p>

      {!isInBroadcastTime && (
        <div className="mt-8 text-center">
          <p className="text-purple-400 text-lg font-bold">
            ⏰ Voltamos às 07:00
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Card de Estatística
 */
function StatCard({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <p className="text-sm text-purple-300">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Obtém nome amigável da categoria
 */
function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    cartoon: 'Desenho',
    educational_clip: 'Educacional',
    commercial: 'Comercial',
    movie: 'Filme',
  };
  return names[category] || category;
}

