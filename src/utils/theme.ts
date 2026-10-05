import { ThemeId } from '../types';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  icon: string;
  bgClass: string;
  cardBg: string;
  gridBg: string;
  tileBg: string;
  tileBorder: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  classic: {
    id: 'classic',
    name: 'Modern Clean',
    icon: '✨',
    bgClass: 'bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100',
    cardBg: 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800',
    gridBg: 'bg-zinc-200 dark:bg-zinc-800',
    tileBg: 'bg-white dark:bg-zinc-900',
    tileBorder: 'border-transparent',
    textPrimary: 'text-zinc-900 dark:text-white',
    textSecondary: 'text-zinc-500 dark:text-zinc-400',
    accent: 'indigo',
  },
  notebook: {
    id: 'notebook',
    name: 'School Notebook',
    icon: '📝',
    bgClass: 'bg-[#f8f6f0] text-slate-900',
    cardBg: 'bg-[#fffef9] border-slate-300 shadow-sm',
    gridBg: 'bg-blue-200/80 border-2 border-dashed border-blue-400',
    tileBg: 'bg-[#fffef9]',
    tileBorder: 'border border-blue-100',
    textPrimary: 'text-slate-900 font-serif',
    textSecondary: 'text-slate-600',
    accent: 'blue',
  },
  neon: {
    id: 'neon',
    name: 'Neon Cyberpunk',
    icon: '⚡',
    bgClass: 'bg-[#090a0f] text-cyan-50 shadow-2xl',
    cardBg: 'bg-[#12141f] border-cyan-900/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
    gridBg: 'bg-[#0e101a] border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    tileBg: 'bg-[#171a2a]',
    tileBorder: 'border border-cyan-500/20',
    textPrimary: 'text-cyan-400',
    textSecondary: 'text-cyan-200/70',
    accent: 'cyan',
  },
  wooden: {
    id: 'wooden',
    name: 'Classic Wood',
    icon: '🪵',
    bgClass: 'bg-[#e8d7be] text-amber-950',
    cardBg: 'bg-[#f4ebd9] border-amber-900/20 shadow-md',
    gridBg: 'bg-[#8d5b36] border-4 border-[#5a381e] shadow-inner',
    tileBg: 'bg-[#dfc4a1]',
    tileBorder: 'border border-[#9b6f48]',
    textPrimary: 'text-amber-950 font-serif',
    textSecondary: 'text-amber-800/80',
    accent: 'amber',
  },
};
