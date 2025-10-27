'use client';

import React from 'react';
import { VideoFolder } from '@/types';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface CategorySelectorProps {
  folders: VideoFolder[];
  onSelectFolder: (folder: VideoFolder) => void;
}

export function CategorySelector({ folders, onSelectFolder }: CategorySelectorProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Escolha uma Categoria</h2>
      </div>
      <p className="text-gray-300 mb-8">
        Selecione uma pasta para adicionar vídeos à programação
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {folders.map((folder) => (
          <motion.button
            key={folder.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectFolder(folder)}
            className="p-6 border-2 border-white/10 rounded-xl hover:border-purple-500 bg-white/5 hover:bg-white/10 transition-all group text-left"
          >
            <div className="flex items-start gap-4">
              <span className="text-5xl group-hover:scale-110 transition-transform">
                {folder.icon || '📁'}
              </span>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg group-hover:text-purple-400 transition-colors">
                  {folder.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {folder.videos.length} vídeo{folder.videos.length !== 1 ? 's' : ''}
                </p>
                {folder.description && (
                  <p className="text-xs text-gray-500 mt-2">{folder.description}</p>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}

