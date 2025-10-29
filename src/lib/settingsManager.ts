// src/lib/settingsManager.ts
// Versão "Livre" — sem limites de uso

import type { AppSettings } from '@/types';
import type { SkillCategory, VideoCategory } from '@/types';

// Chaves antigas mantidas apenas para evitar erros se ainda existirem no localStorage
const STORAGE_KEYS = {
  SETTINGS: 'app_settings',
  VIEWING_TIME: 'viewing_time_seconds',
  VIEWING_DATE: 'viewing_date',
  SESSION_START: 'session_start_ts',
  VIDEO_PROGRESS: 'video_progress_map',
} as const;

// ===== Labels e helpers (novos) =====
const SKILL_LABELS: Record<SkillCategory, string> = {
  language: 'Linguagem',
  motor_skills: 'Coordenação motora',
  cognitive: 'Cognitivo',
  socioemotional: 'Socioemocional',
  creativity: 'Criatividade',
};

const CATEGORY_LABELS: Record<VideoCategory, string> = {
  cartoon: 'Desenhos',
  educational_clip: 'Clipe educativo',
  commercial: 'Intervalo/Comercial',
  movie: 'Filme',
};


export function getSkillLabel(skill: SkillCategory): string {
  return SKILL_LABELS[skill] ?? skill;
}

export function getCategoryLabel(category: VideoCategory): string {
  return CATEGORY_LABELS[category] ?? category;
}
// ===== fim helpers =====

// Retorna configurações; se houver algo salvo, mantém, mas nada mais é usado para restringir
export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return JSON.parse(raw) as AppSettings;
  } catch {}
  // Defaults “livres”
  return {
    // Preferências úteis (ajuste como quiser)
    autoplay: true,
    defaultVolume: 0.8,

    // Campos do seu app que a UI usa:
    prioritizedSkills: [],
    allowedCategories: ['cartoon', 'educational_clip', 'commercial'],

    // Tudo relacionado a limite fica desativado:
    enabledParentalControls: false,
    interruptLongVideos: false,
    allowVideoResumption: true,
  } as AppSettings;
}

export function saveSettings(settings: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {}
}

// 🔓 Sempre falso: nunca atingiu limite
export function isDailyLimitReached(): boolean {
  return false;
}

// 🔓 No-op: não contabiliza tempo de tela
export function addViewingTime(_seconds: number) {
  // intencionalmente vazio
}

// (Opcional – compat) Sempre retorna um número alto para evitar UI quebrar
export function getRemainingDailyTime(): number {
  return 9999; // "minutos infinitos"
}

// Mantemos progresso de vídeo porque é útil aos pais/criança
type ProgressMap = Record<string, number>;

export function saveVideoProgress(videoId: string, seconds: number) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VIDEO_PROGRESS);
    const map: ProgressMap = raw ? JSON.parse(raw) : {};
    map[videoId] = seconds;
    localStorage.setItem(STORAGE_KEYS.VIDEO_PROGRESS, JSON.stringify(map));
  } catch {}
}

export function getVideoProgress(videoId: string): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VIDEO_PROGRESS);
    const map: ProgressMap = raw ? JSON.parse(raw) : {};
    return map[videoId] ?? 0;
  } catch {
    return 0;
  }
}

// Utilitário: limpeza dos dados legados de limite (opcional, execute uma vez)
export function clearLegacyLimitData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.VIEWING_TIME);
    localStorage.removeItem(STORAGE_KEYS.VIEWING_DATE);
    localStorage.removeItem(STORAGE_KEYS.SESSION_START);
  } catch {}
}
