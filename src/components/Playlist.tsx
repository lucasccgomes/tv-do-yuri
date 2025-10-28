'use client';

import { motion } from 'framer-motion';
import { ScheduledProgram } from '@/lib/scheduleGenerator';
import { Clock, Play } from 'lucide-react';
import { getCategoryLabel } from '@/lib/settingsManager';
// A lista de vídeos deve ser passada via props ou obtida de um hook/context,
// mas para o componente de playlist, podemos simplificar a lógica de duração
// ou assumir que o `ScheduledProgram` tem a duração.
// Como o `ScheduledProgram` tem `startAt` e `endAt`, usaremos isso.

export interface PlaylistProps {
  programs: ScheduledProgram[];
  currentIndex: number;
}

// Função auxiliar para formatar a duração de um programa em minutos
const formatDuration = (program: ScheduledProgram): string => {
  // Se o programa tiver endAt e startAt, calcula a duração do segmento.
  // Caso contrário, usa a duração total do vídeo.
  const durationInSeconds = program.endAt && program.startAt
    ? program.endAt - program.startAt
    : program.duration; // Assumindo que ScheduledProgram tem a propriedade duration

  if (!durationInSeconds) return '—';

  const durationInMinutes = Math.ceil(durationInSeconds / 60);
  return `${durationInMinutes} min`;
};

// Função auxiliar para obter o status do programa com base no currentIndex
const getProgramStatus = (index: number, currentIndex: number): 'past' | 'current' | 'future' => {
  if (index === currentIndex) {
    return 'current';
  }
  if (index < currentIndex) {
    return 'past';
  }
  return 'future';
};

/**
 * Componente que exibe a grade de programação do dia
 */
export function Playlist({ programs, currentIndex }: PlaylistProps) {
  if (!programs || programs.length === 0) {
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

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        📅 Programação de Hoje
      </h2>

      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-900/20">
        {programs.map((program, index) => {
          const status = getProgramStatus(index, currentIndex);
          const isCurrentProgram = status === 'current';

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
                    {program.title || program.videoId}
                  </h3>

                  <div className="flex items-center gap-3 text-sm">
                    {/* Categoria */}
                    <span
                      className={`
                      px-2 py-1 rounded-md font-semibold
                      ${
                        program.category === 'cartoon'
                          ? 'bg-blue-500/20 text-blue-300'
                          : program.category === 'educational_clip'
                          ? 'bg-green-500/20 text-green-300'
                          : program.category === 'commercial'
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'bg-red-500/20 text-red-300' // Para 'movie' e outros
                      }
                    `}
                    >
                      {getCategoryLabel(program.category as any)}
                    </span>

                    {/* Duração */}
                    <span className="text-purple-300">
                      {formatDuration(program)}
                    </span>

                    {/* Indicador de bloco */}
                    {(program.startAt !== undefined || program.endAt !== undefined) && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                        Bloco
                      </span>
                    )}
                  </div>

                  {/* Descrição (apenas para programa atual) */}
                  {isCurrentProgram && program.description && (
                    <p className="text-purple-200 text-sm mt-2 line-clamp-2">{program.description}</p>
                  )}
                </div>

                {/* Thumbnail (se disponível) */}
                {program.thumbnail && (
                  <div className="flex-shrink-0 hidden sm:block">
                    <img
                      src={program.thumbnail}
                      alt={program.title}
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
