'use client';

import React from 'react';
import { PlaylistItem } from '@/types';
import { Play, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlaylistProps {
  items: PlaylistItem[];
  currentIndex: number;

}

export function Playlist({ items, currentIndex }: PlaylistProps) {
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'cartoon':
        return { label: 'Desenho', icon: '🎬', color: 'from-blue-500 to-cyan-500' };
      case 'educational_clip':
        return { label: 'Educativo', icon: '📚', color: 'from-green-500 to-emerald-500' };
      case 'commercial':
        return { label: 'Comercial', icon: '📢', color: 'from-orange-500 to-red-500' };
      default:
        return { label: category, icon: '📺', color: 'from-gray-500 to-slate-500' };
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 -m-6 mb-6 p-6 rounded-t-xl">
        <h2 className="text-white font-bold text-2xl flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Próximos Vídeos
        </h2>
        <p className="text-purple-100 text-sm mt-1">
          {items.length} vídeos na programação
        </p>
      </div>

      <div className="max-h-96 overflow-y-auto pr-2">
        {items.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p>Nenhum vídeo na playlist</p>
          </div>
        ) : (
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {items.map((item, index) => {
              const category = getCategoryLabel(item.video.category);
              const isActive = index === currentIndex;

              return (
                <motion.li
                  key={`${item.video.id}-${index}`}
                  variants={itemVariants}

                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/50 to-pink-600/50 border-l-4 border-purple-400 shadow-lg shadow-purple-500/20'
                      : 'bg-white/5 hover:bg-white/10 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isActive && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Play className="w-5 h-5 text-purple-400 fill-purple-400 mt-0.5" />
                      </motion.div>
                    )}
                    {!isActive && <div className="w-5 h-5 mt-0.5" />}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${category.color} text-white`}>
                          {category.icon} {category.label}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(item.video.duration)}
                        </span>
                      </div>
                      <p className="font-semibold text-sm text-white truncate">
                        {item.video.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{item.reason}</p>
                      {item.video.educationalValue && (
                        <p className="text-xs text-purple-300 mt-2">
                          📖 {item.video.educationalValue}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </div>
    </motion.div>
  );
}

