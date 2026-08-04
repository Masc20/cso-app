import { Code2, Gamepad2, Network, Palette } from 'lucide-react';
import type { Committee } from '@/types';

export type { Committee };

export const COMMITTEES: Committee[] = [
  {
    id: 'G.A.D Committee', name: 'G.A.D Committee', shortName: 'G.A.D',
    description: 'Spearheading visual identity, UI/UX prototyping, event posters, motion graphics, and media branding.',
    logo: '/imgs/Committees/GAD/Logo.png', accentColor: 'from-[#f59e0b] via-[#ec4899] to-[#10b981]',
    borderGlow: 'hover:shadow-amber-500/40 border-amber-500/60 dark:border-amber-400/50',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    Icon: Palette, iconClassName: 'text-amber-500', tags: ['UI/UX Design', 'Photoshop & Figma', 'Branding'],
    videoUrl: 'GAD%20Committee.mp4',
    videoTitle: 'G.A.D Committee 2025-2026',
  },
  {
    id: 'Gaming Committee', name: 'Gaming Committee', shortName: 'Gaming',
    description: 'Organizing esports tournaments, game development workshops, shoutcasting, and campus gaming events.',
    logo: '/imgs/Committees/Gaming/Logo.png', accentColor: 'from-[#10b981] to-[#059669]',
    borderGlow: 'hover:shadow-emerald-500/40 border-emerald-500/60 dark:border-emerald-400/50',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    Icon: Gamepad2, iconClassName: 'text-emerald-500', tags: ['Esports Ops', 'Tournament Hosting', 'Game Dev'],
  },
  {
    id: 'Networking Committee', name: 'Networking Committee', shortName: 'Networking',
    description: 'Managing event network infrastructure, server management, cybersecurity, IoT setups, and hardware.',
    logo: '/imgs/Committees/Networking/Logo.png', accentColor: 'from-[#0ea5e9] to-[#0284c7]',
    borderGlow: 'hover:shadow-sky-500/40 border-sky-500/60 dark:border-sky-400/50',
    badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
    Icon: Network, iconClassName: 'text-sky-500', tags: ['SysAdmin', 'LAN & Wi-Fi Setup', 'Cybersecurity'],
    videoUrl: 'Networking%20Committee.mp4',
    videoTitle: 'Networking Committee 2025-2026'
  },
  {
    id: 'Programming Committee', name: 'Programming Committee', shortName: 'Programming',
    description: 'Leading web & mobile development, competitive coding, hackathons, API integrations, and code reviews.',
    logo: '/imgs/Committees/Programming/Logo.png', accentColor: 'from-[#d946ef] to-[#c026d3]',
    borderGlow: 'hover:shadow-fuchsia-500/40 border-fuchsia-500/60 dark:border-fuchsia-400/50',
    badgeBg: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/30',
    Icon: Code2, iconClassName: 'text-fuchsia-500', tags: ['Web & Mobile', 'Competitive Coding', 'Hackathons'],
  },
];

export const COMMITTEE_OPTIONS = COMMITTEES.map(({ id, name }) => ({ id, label: name }));
