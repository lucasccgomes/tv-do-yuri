'use client';

import { useEffect, useState } from 'react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Playlist } from '@/components/Playlist';
import { CategorySelector } from '@/components/CategorySelector';
import { SettingsModal } from '@/components/SettingsModal';
import { useTV } from '@/hooks/useTV';
import { videoFolders } from '@/lib/mockData';
import { Settings, RotateCcw, Menu, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isDailyLimitReached, getRemainingDailyTime } from '@/lib/settingsManager';
import DailyLimitModal from '@/components/DailyLimitModal';

export default function Home() {
  const tv = useTV();
  const [showDailyLimitModal, setShowDailyLimitModal] = useState(false);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [remainingTime, setRemainingTime] = useState(getRemainingDailyTime());

  useEffect(() => {
    setShowDailyLimitModal(tv.dailyLimitReached);
  }, [tv.dailyLimitReached]);

  useEffect(() => {
    if (tv.currentVideo) {
      const isLimitReached = isDailyLimitReached();
      setDailyLimitReached(isLimitReached);
      setRemainingTime(getRemainingDailyTime());

      if (!isLimitReached) {
        // Não chamamos tv.play() aqui diretamente para permitir que o VideoPlayer
        // lide com a tentativa de autoplay e mute inicial.
        // Apenas garantimos que o estado isPlaying em useTV esteja correto.
        if (!tv.isPlaying) {
          tv.play();
        }
      }
    }
  }, [tv.currentVideo]);

  const handleSelectFolder = () => {
    // Placeholder para seleção de pasta
    // A lógica de programação será baseada nas configurações do usuário
    tv.restart();
    setShowCategorySelector(false);
  };

  return (
    <div className="min-h-screen gradient-dark">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="text-4xl"
            >
              📺
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                TV do Yuri
              </h1>
              <p className="text-purple-200 text-sm">Programação educativa para crianças</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCategorySelector(!showCategorySelector)}
              className="btn-primary hidden sm:block"
            >
              + Adicionar Categoria
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => tv.restart()}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              title="Reiniciar programação"
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettingsModal(true)}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              title="Configurações"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Aviso de Limite de Tempo Atingido */}
      <AnimatePresence>
        {dailyLimitReached && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-md"
          >
            <div className="bg-red-600 text-white rounded-lg p-4 shadow-lg flex items-center gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-bold">Limite de Tempo Atingido!</p>
                <p className="text-sm">Seu filho atingiu o limite de tempo de tela de hoje. Que tal fazer outra atividade?</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Seletor de Categorias */}
        <AnimatePresence>
          {showCategorySelector && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <CategorySelector
                folders={videoFolders}
                onSelectFolder={() => handleSelectFolder()}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player Principal */}
        {/* Player Principal */}
        <motion.div
          initial={false}                 // evita animar na montagem
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="card transition-none">
            <VideoPlayer
              video={tv.currentVideo}
              isPlaying={tv.isPlaying}
              initialTime={tv.currentVideoProgress}
              onProgress={tv.reportVideoProgress}
              segmentStartAt={tv.segmentStartAt}
              segmentEndAt={tv.segmentEndAt}
              onVideoEnd={tv.next}
              blocked={tv.dailyLimitReached} // <= bloqueia interação
            />

            {/* Modal de limite diário */}
            <DailyLimitModal
              open={showDailyLimitModal}
              onClose={() => setShowDailyLimitModal(false)} // fecha o modal; o bloqueio continua até virar o dia ou você resetar
            />

            {/* Pré-carrega o próximo vídeo para reduzir travadinhas na troca */}
            {tv.playlist[tv.currentIndex + 1]?.video?.url ? (
              <video
                src={tv.playlist[tv.currentIndex + 1].video.url}
                preload="auto"
                playsInline
                muted
                className="hidden"
              />
            ) : null}

            {/* Informações do Vídeo */}
            {tv.currentVideo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-purple-200 text-sm font-semibold">Título</p>
                    <p className="text-white font-bold text-lg mt-1">{tv.currentVideo.title}</p>
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm font-semibold">Categoria</p>
                    <p className="text-white font-bold mt-1">
                      {tv.currentVideo.category === 'cartoon'
                        ? '🎬 Desenho'
                        : tv.currentVideo.category === 'educational_clip'
                          ? '📚 Educativo'
                          : '📢 Comercial'}
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm font-semibold">Valor Educativo</p>
                    <p className="text-white font-bold mt-1">
                      {tv.currentVideo.educationalValue || '—'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>


        {/* Layout com Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Playlist */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Playlist
              items={tv.playlist}
              currentIndex={tv.currentIndex}

            />
          </motion.div>

          {/* Sidebar com Informações */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Estatísticas */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                >
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Estatísticas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-purple-200">Total de Vídeos</span>
                      <span className="text-white font-bold text-lg">{tv.playlist.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-purple-200">Vídeo Atual</span>
                      <span className="text-white font-bold text-lg">{tv.currentIndex + 1}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-purple-200">Status</span>
                      <span className="text-white font-bold">
                        {tv.isPlaying ? '▶️ Reproduzindo' : '⏸️ Pausado'}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Tempo Restante */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/30"
                >
                  <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="text-2xl">⏱️</span>
                    Tempo de Tela
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-green-200 text-sm font-semibold mb-2">Tempo Restante Hoje</p>
                      <div className="bg-white/10 rounded-lg p-3">
                        <p className="text-white font-bold text-2xl">{remainingTime} min</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowSettingsModal(true)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all"
                    >
                      ⚙️ Configurar Limites
                    </motion.button>
                  </div>
                </motion.div>

                {/* Dicas para Pais */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-400/30"
                >
                  <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    Dicas para Pais
                  </h3>
                  <ul className="space-y-2 text-sm text-purple-100">
                    <li className="flex items-start gap-2">
                      <span>✓</span>
                      <span>Conteúdo selecionado para 3-4 anos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>✓</span>
                      <span>Intercalação automática de educativo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>✓</span>
                      <span>Comerciais educativos entre programas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>✓</span>
                      <span>Sem publicidade invasiva</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>✓</span>
                      <span>Seguro e controlado por você</span>
                    </li>
                  </ul>
                </motion.div>

                {/* Controles Rápidos */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                >
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎮</span>
                    Controles Rápidos
                  </h3>
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={tv.play}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all"
                    >
                      ▶️ Reproduzir
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={tv.pause}
                      className="w-full px-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg font-semibold transition-all"
                    >
                      ⏸️ Pausar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={tv.next}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all"
                    >
                      ⏭️ Próximo
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-t border-white/10 bg-black/40 mt-16 py-8"
      >
        <div className="max-w-7xl mx-auto px-4 text-center text-purple-200">
          <p>
            TV do Yuri © 2024 - Programação educativa e segura para crianças
          </p>
        </div>
      </motion.footer>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </div>
  );
}

