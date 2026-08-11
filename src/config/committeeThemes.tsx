import React from 'react';
import { Palette, Gamepad2, Network, Code2 } from 'lucide-react';
import type { Committee } from '@/types';

export interface ThemeConfig {
  key: string;
  label: string;
  iconColor: string;
  borderBg: string;
  glowClass: string;
  accentLine: string;
  badgeBg: string;
  ctaHoverText: string;
}

export const COMMITTEE_THEMES: Record<string, ThemeConfig> = {
  amber: {
    key: 'amber',
    label: 'Amber (G.A.D / Creative)',
    iconColor: 'text-amber-500',
    borderBg: 'bg-amber-500/60 dark:bg-amber-400/50 group-hover:bg-amber-500',
    glowClass: 'ribbon-glow-amber',
    accentLine: 'from-[#f59e0b] via-[#ec4899] to-[#10b981]',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    ctaHoverText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400'
  },
  emerald: {
    key: 'emerald',
    label: 'Emerald (Gaming / Esports)',
    iconColor: 'text-emerald-500',
    borderBg: 'bg-emerald-500/60 dark:bg-emerald-400/50 group-hover:bg-emerald-500',
    glowClass: 'ribbon-glow-emerald',
    accentLine: 'from-[#10b981] to-[#059669]',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    ctaHoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
  },
  sky: {
    key: 'sky',
    label: 'Sky Blue (Networking / Tech)',
    iconColor: 'text-sky-500',
    borderBg: 'bg-sky-500/60 dark:bg-sky-400/50 group-hover:bg-sky-500',
    glowClass: 'ribbon-glow-sky',
    accentLine: 'from-[#0ea5e9] to-[#0284c7]',
    badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
    ctaHoverText: 'group-hover:text-sky-600 dark:group-hover:text-sky-400'
  },
  fuchsia: {
    key: 'fuchsia',
    label: 'Fuchsia (Programming / Dev)',
    iconColor: 'text-fuchsia-500',
    borderBg: 'bg-fuchsia-500/60 dark:bg-fuchsia-400/50 group-hover:bg-fuchsia-500',
    glowClass: 'ribbon-glow-fuchsia',
    accentLine: 'from-[#d946ef] to-[#c026d3]',
    badgeBg: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/30',
    ctaHoverText: 'group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400'
  },
  rose: {
    key: 'rose',
    label: 'Rose (Red)',
    iconColor: 'text-rose-500',
    borderBg: 'bg-rose-500/60 dark:bg-rose-400/50 group-hover:bg-rose-500',
    glowClass: 'ribbon-glow-rose',
    accentLine: 'from-[#f43f5e] to-[#e11d48]',
    badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    ctaHoverText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400'
  },
  indigo: {
    key: 'indigo',
    label: 'Indigo (Deep Blue)',
    iconColor: 'text-indigo-500',
    borderBg: 'bg-indigo-500/60 dark:bg-indigo-400/50 group-hover:bg-indigo-500',
    glowClass: 'ribbon-glow-indigo',
    accentLine: 'from-[#6366f1] to-[#4f46e5]',
    badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    ctaHoverText: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
  },
  violet: {
    key: 'violet',
    label: 'Violet (Purple)',
    iconColor: 'text-violet-500',
    borderBg: 'bg-violet-500/60 dark:bg-violet-400/50 group-hover:bg-violet-500',
    glowClass: 'ribbon-glow-violet',
    accentLine: 'from-[#8b5cf6] to-[#7c3aed]',
    badgeBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30',
    ctaHoverText: 'group-hover:text-violet-600 dark:group-hover:text-violet-400'
  }
};

export const THEME_COLOR_OPTIONS = Object.values(COMMITTEE_THEMES).map(t => ({
  value: t.key,
  label: t.label
}));

export function resolveCommitteeTheme(comm: Partial<Committee>): ThemeConfig {
  const explicitKey = (comm.themeColor || comm.theme_color || '').toLowerCase();
  if (explicitKey && COMMITTEE_THEMES[explicitKey]) {
    return COMMITTEE_THEMES[explicitKey];
  }

  const str = `${comm.id || ''} ${comm.name || ''} ${comm.shortName || ''} ${comm.short_name || ''}`.toLowerCase();
  if (str.includes('gad') || str.includes('g.a.d')) return COMMITTEE_THEMES.amber;
  if (str.includes('gaming')) return COMMITTEE_THEMES.emerald;
  if (str.includes('networking') || str.includes('network')) return COMMITTEE_THEMES.sky;
  if (str.includes('programming')) return COMMITTEE_THEMES.fuchsia;

  return COMMITTEE_THEMES.fuchsia;
}

export function getCommitteeIcon(shortNameOrName: string) {
  const str = (shortNameOrName || '').toLowerCase();
  if (str.includes('gad') || str.includes('g.a.d')) return <Palette className="w-5 h-5 text-amber-500" />;
  if (str.includes('gaming')) return <Gamepad2 className="w-5 h-5 text-emerald-500" />;
  if (str.includes('networking') || str.includes('network')) return <Network className="w-5 h-5 text-sky-500" />;
  if (str.includes('programming')) return <Code2 className="w-5 h-5 text-fuchsia-500" />;
  return <Code2 className="w-5 h-5 text-sky-500" />;
}
