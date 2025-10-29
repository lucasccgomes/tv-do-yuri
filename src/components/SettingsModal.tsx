'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, RotateCcw } from 'lucide-react';
import type { AppSettings } from '@/types';
import type { SkillCategory, VideoCategory } from '@/types';
import {
  getSettings,
  saveSettings,
  // resetSettings, // removido
  getSkillLabel,
  getCategoryLabel,
} from '@/lib/settingsManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    saveSettings(settings);
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 500);
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja resetar as preferências (sem limites)?')) {
      setSettings((prev) => ({
        ...prev,
        prioritizedSkills: [],
        allowedCategories: ['cartoon', 'educational_clip', 'commercial'],
        enabledParentalControls: false,
        interruptLongVideos: false,
        allowVideoResumption: true,
      }));
    }
  };

  const toggleSkill = (skill: SkillCategory) => {
    setSettings((prev) => ({
      ...prev,
      prioritizedSkills: prev.prioritizedSkills.includes(skill)
        ? prev.prioritizedSkills.filter((s) => s !== skill)
        : [...prev.prioritizedSkills, skill],
    }));
  };

  const toggleCategory = (category: VideoCategory) => {
    setSettings((prev) => ({
      ...prev,
      allowedCategories: prev.allowedCategories.includes(category)
        ? prev.allowedCategories.filter((c) => c !== category)
        : [...prev.allowedCategories, category],
    }));
  };

  const skillOptions: SkillCategory[] = ['language', 'motor_skills', 'cognitive', 'socioemotional', 'creativity'];
  const categoryOptions: VideoCategory[] = ['cartoon', 'educational_clip', 'commercial', 'movie'];


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between border-b border-white/10">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-3xl">⚙️</span>
                  Configurações
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Habilidades Priorizadas */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    Habilidades Priorizadas
                  </h3>
                  <p className="text-purple-200 text-sm mb-3">
                    Selecione as habilidades que deseja priorizar na programação:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {skillOptions.map((skill) => (
                      <motion.button
                        key={skill}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleSkill(skill)}
                        className={`p-3 rounded-lg font-semibold transition-all text-left ${
                          settings.prioritizedSkills.includes(skill)
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-white/10 text-purple-200 hover:bg-white/20'
                        }`}
                      >
                        {getSkillLabel(skill)}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Categorias Permitidas */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="text-2xl">📺</span>
                    Categorias de Conteúdo Permitidas
                  </h3>
                  <p className="text-purple-200 text-sm mb-3">
                    Selecione quais tipos de conteúdo são permitidos:
                  </p>
                  <div className="space-y-2">
                    {categoryOptions.map((category) => (
                      <motion.button
                        key={category}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleCategory(category)}
                        className={`w-full p-3 rounded-lg font-semibold transition-all text-left ${
                          settings.allowedCategories.includes(category)
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                            : 'bg-white/10 text-purple-200 hover:bg-white/20'
                        }`}
                      >
                        {getCategoryLabel(category)}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-slate-900/80 backdrop-blur px-6 py-4 border-t border-white/10 flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Resetar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
