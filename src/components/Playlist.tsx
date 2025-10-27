'use client';

import { motion } from 'framer-motion';
import { ScheduledProgram } from '@/lib/gradeSemanal';
import { allVideos } from '@/lib/mockData';
import { Clock, Play } from 'lucide-react';

interface PlaylistProps {
  schedule: ScheduledProgram[];
  currentProgram: ScheduledProgram | null;
}

/**
 * Componente que exibe a grade de programação do dia
 */
export function Playlist({ schedule, currentProgram }: PlaylistProps) {
  if (!schedule || schedule.length === 0) {
    return (
      <div className="card">
        <h2 className="text-white font-bold text-2xl mb-4 flex items-center gap-2">
          <span className="text-3xl">📋</span>
          Grade de Programação
        </h2>
        <p className="text-purple-200 text-center py-8">
          Nenhuma programação disponível para hoje.
        </p>
      </div>
    );
  }

  // Função para formatar duração em minutos
  const formatDuration = (videoId: string, startAt?: number, endAt?: number): string => {
    const video = allVideos.find((v) => v.id === videoId);
    if (!video) return '—';

    const start = startAt || 0;
    const end = endAt || video.duration;
    const durationInMinutes = Math.ceil((end - start) / 60);

    return `${durationInMinutes} min`;
  };

  // Função para determinar se um programa já passou, está no ar ou ainda vai ao ar
  const getProgramStatus = (programTime: string): 'past' | 'current' | 'future' => {
    const now = new Date();
    const [h, m, s] = programTime.split(':').map(Number);
    const programDate = new Date(now);
    programDate.setHours(h, m, s, 0);

    const currentTimeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const programTimeInSeconds = h * 3600 + m * 60 + s;

    if (currentProgram && programTime === currentProgram.time) {
      return 'current';
    }

    if (programTimeInSeconds < currentTimeInSeconds) {
      return 'past';
    }

    return 'future';
  };

  return (
    <div className="card">
      <h2 className="text-white font-bold text-2xl mb-6 flex items-center gap-2">
        <span className="text-3xl">📋</span>
        Grade de Programação de Hoje
      </h2>

      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-900/20">
        {schedule.map((program, index) => {
          const status = getProgramStatus(program.time);
          const video = allVideos.find((v) => v.id === program.videoId);
          const isCurrentProgram = currentProgram?.time === program.time;

          return (
            <motion.div
              key={`${program.time}-${program.videoId}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className={`
                relative p-4 rounded-lg border transition-all duration-300
                ${
                  isCurrentProgram
                    ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-400 shadow-lg shadow-purple-500/20'
                    : status === 'past'
                    ? 'bg-white/5 border-white/10 opacity-50'
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                }
              `}
            >
              {/* Indicador de programa atual */}
              {isCurrentProgram && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -left-2 top-1/2 -translate-y-1/2"
                >
                  <Play className="w-6 h-6 text-purple-400 fill-purple-400" />
                </motion.div>
              )}

              <div className="flex items-start gap-4">
                {/* Horário */}
                <div className="flex-shrink-0">
                  <div
                    className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg
                    ${
                      isCurrentProgram
                        ? 'bg-purple-500 text-white'
                        : status === 'past'
                        ? 'bg-gray-600 text-gray-300'
                        : 'bg-purple-900/50 text-purple-200'
                    }
                  `}
                  >
                    <Clock className="w-4 h-4" />
                    <span className="font-bold text-sm">{program.time.substring(0, 5)}</span>
                  </div>
                </div>

                {/* Informações do programa */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`
                    font-bold text-lg mb-1 truncate
                    ${isCurrentProgram ? 'text-white' : 'text-purple-100'}
                  `}
                  >
                    {program.title || video?.title || 'Programa'}
                  </h3>

                  <div className="flex items-center gap-3 text-sm">
                    {/* Categoria */}
                    <span
                      className={`
                      px-2 py-1 rounded-md font-semibold
                      ${
                        video?.category === 'cartoon'
                          ? 'bg-blue-500/20 text-blue-300'
                          : video?.category === 'educational_clip'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-orange-500/20 text-orange-300'
                      }
                    `}
                    >
                      {video?.category === 'cartoon'
                        ? '🎬 Desenho'
                        : video?.category === 'educational_clip'
                        ? '📚 Educativo'
                        : '📢 Comercial'}
                    </span>

                    {/* Duração */}
                    <span className="text-purple-300">
                      {formatDuration(program.videoId, program.startAt, program.endAt)}
                    </span>

                    {/* Indicador de bloco */}
                    {(program.startAt !== undefined || program.endAt !== undefined) && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                        Bloco
                      </span>
                    )}
                  </div>

                  {/* Descrição (apenas para programa atual) */}
                  {isCurrentProgram && video?.description && (
                    <p className="text-purple-200 text-sm mt-2 line-clamp-2">{video.description}</p>
                  )}
                </div>

                {/* Thumbnail (se disponível) */}
                {video?.thumbnail && (
                  <div className="flex-shrink-0 hidden sm:block">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-20 h-14 object-cover rounded-lg border border-white/20"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-purple-200">No ar agora</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-600"></div>
            <span className="text-purple-200">Já exibido</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-900"></div>
            <span className="text-purple-200">Próximos</span>
          </div>
        </div>
      </div>
    </div>
  );
}

