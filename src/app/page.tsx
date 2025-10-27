'use client';

import { useEffect, useState } from 'react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Playlist } from '@/components/Playlist';
import { SettingsModal } from '@/components/SettingsModal';
import { useTV } from '@/hooks/useTV';
import { Settings, RotateCcw, Tv, AlertCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isDailyLimitReached, getRemainingDailyTime } from '@/lib/settingsManager';
import DailyLimitModal from '@/components/DailyLimitModal';

export default function Home() {
  const tv = useTV();
  const [showDailyLimitModal, setShowDailyLimitModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [remainingTime, setRemainingTime] = useState(getRemainingDailyTime());

  useEffect(() => {
    setShowDailyLimitModal(tv.dailyLimitReached);
  }, [tv.dailyLimitReached]);

  useEffect(() => {
    const isLimitReached = isDailyLimitReached();
    setDailyLimitReached(isLimitReached);
    setRemainingTime(getRemainingDailyTime());
  }, [tv.currentVideo]);

  // Formata o horário do próximo programa
  const formatNextProgramTime = () => {
    if (!tv.nextProgram) return '—';
    return tv.nextProgram.time.substring(0, 5);
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
              <p className="text-purple-200 text-sm">Canal educativo ao vivo</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Indicador de status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg">
              {tv.isOffAir ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-sm text-white font-semibold">Fora do Ar</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm text-white font-semibold">Ao Vivo</span>
                </>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => tv.restart()}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              title="Atualizar programação"
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
                <p className="text-sm">
                  Seu filho atingiu o limite de tempo de tela de hoje. Que tal fazer outra atividade?
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aviso de Fora do Ar */}
      <AnimatePresence>
        {tv.isOffAir && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-md"
          >
            <div className="bg-purple-600 text-white rounded-lg p-4 shadow-lg flex items-center gap-3">
              <Tv className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-bold">Fora do Ar</p>
                <p className="text-sm">
                  A programação está encerrada no momento. Volte mais tarde!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Player Principal */}
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="card transition-none">
            {tv.isOffAir ? (
              // Tela de fora do ar
              <div className="aspect-video bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg flex flex-col items-center justify-center">
                <Tv className="w-24 h-24 text-white/50 mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Fora do Ar</h2>
                <p className="text-purple-200 text-center max-w-md">
                  A programação da TV do Yuri funciona das 07:00 às 20:00. Volte amanhã para mais diversão!
                </p>
                {tv.nextProgram && (
                  <div className="mt-6 bg-white/10 rounded-lg p-4">
                    <p className="text-purple-200 text-sm mb-1">Próximo programa:</p>
                    <p className="text-white font-bold text-lg">
                      {tv.nextProgram.title || 'Programação'} às {formatNextProgramTime()}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <VideoPlayer
                video={tv.currentVideo}
                isPlaying={tv.isPlaying}
                initialTime={tv.currentVideoProgress}
                onProgress={tv.reportVideoProgress}
                segmentStartAt={tv.segmentStartAt}
                segmentEndAt={tv.segmentEndAt}
                onVideoEnd={() => { }} // Não precisa mais, a lógica é automática
                blocked={tv.dailyLimitReached}
              />
            )}

            {/* Modal de limite diário */}
            <DailyLimitModal
              open={showDailyLimitModal}
              onClose={() => setShowDailyLimitModal(false)}
            />

            {/* Informações do Programa Atual */}
            {tv.currentVideo && tv.currentProgram && !tv.isOffAir && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-purple-200 text-sm font-semibold">Programa Atual</p>
                    <p className="text-white font-bold text-lg mt-1">
                      {tv.currentProgram.title || tv.currentVideo.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm font-semibold">Horário</p>
                    <p className="text-white font-bold mt-1 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {tv.currentProgram.time.substring(0, 5)}
                    </p>
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
                </div>

                {/* Próximo Programa */}
                {tv.nextProgram && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-purple-200 text-sm mb-2">
                      <span className="font-semibold">Próximo:</span> {tv.nextProgram.title || 'Programa'}{' '}
                      às {formatNextProgramTime()}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Layout com Grade e Informações */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Grade de Programação */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Playlist schedule={tv.todaySchedule} currentProgram={tv.currentProgram} />
          </motion.div>

          {/* Sidebar com Informações */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
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
                  <span className="text-purple-200">Programas Hoje</span>
                  <span className="text-white font-bold text-lg">{tv.todaySchedule.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-purple-200">Status</span>
                  <span className="text-white font-bold">
                    {tv.isOffAir ? '📴 Fora do Ar' : tv.isPlaying ? '▶️ Ao Vivo' : '⏸️ Pausado'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-purple-200">Tempo Restante Hoje</span>
                  <span className="text-white font-bold text-lg">{remainingTime} min</span>
                </div>
              </div>
            </motion.div>

            {/* Dicas para Pais */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                Como Funciona
              </h3>
              <div className="space-y-3 text-purple-200 text-sm">
                <p>
                  📺 A <strong>TV do Yuri</strong> funciona como um canal de TV tradicional, com
                  programação fixa.
                </p>
                <p>
                  ⏰ Se você ligar às <strong>7:20</strong>, o programa que começou às 7:00 já estará em
                  andamento.
                </p>
                <p>
                  📋 A grade semanal é <strong>gerenciável</strong> e pode ser editada no arquivo{' '}
                  <code className="bg-white/10 px-1 rounded">gradeSemanal.ts</code>
                </p>
                <p>
                  🎬 Vídeos longos são automaticamente <strong>divididos em blocos</strong> conforme
                  configurado na grade.
                </p>
                <p>
                  🕐 Horário de funcionamento: <strong>07:00 às 20:00</strong>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Modal de Configurações */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => {
          setShowSettingsModal(false);
          tv.restart(); // Atualiza a programação após fechar
        }}
      />
    </div>
  );
}

