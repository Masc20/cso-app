'use client';

import React from 'react';
import { Palette, Gamepad2, Network, Code2, ArrowRight } from 'lucide-react';

export interface CommitteeInfo {
  id: string;
  name: string;
  shortName: string;
  description: string;
  logo: string;
  accentColor: string;
  borderGlow: string;
  badgeBg: string;
  icon: React.ReactNode;
  tags: string[];
}

const COMMITTEES: CommitteeInfo[] = [
  {
    id: 'G.A.D',
    name: 'G.A.D (Graphics and Design)',
    shortName: 'G.A.D',
    description: 'Spearheading visual identity, UI/UX prototyping, event posters, motion graphics, and media branding.',
    logo: '/imgs/Committees/GAD/Logo.png',
    accentColor: 'from-[#f59e0b] via-[#ec4899] to-[#10b981]',
    borderGlow: 'hover:shadow-amber-500/40 border-amber-500/60 dark:border-amber-400/50',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    icon: <Palette className="w-5 h-5 text-amber-500" />,
    tags: ['UI/UX Design', 'Photoshop & Figma', 'Branding']
  },
  {
    id: 'Gaming Committee',
    name: 'Gaming Committee',
    shortName: 'Gaming',
    description: 'Organizing esports tournaments, game development workshops, shoutcasting, and campus gaming events.',
    logo: '/imgs/Committees/Gaming/Logo.png',
    accentColor: 'from-[#10b981] to-[#059669]',
    borderGlow: 'hover:shadow-emerald-500/40 border-emerald-500/60 dark:border-emerald-400/50',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    icon: <Gamepad2 className="w-5 h-5 text-emerald-500" />,
    tags: ['Esports Ops', 'Tournament Hosting', 'Game Dev']
  },
  {
    id: 'Networking Committee',
    name: 'Networking Committee',
    shortName: 'Networking',
    description: 'Managing event network infrastructure, server management, cybersecurity, IoT setups, and hardware.',
    logo: '/imgs/Committees/Networking/Logo.png',
    accentColor: 'from-[#0ea5e9] to-[#0284c7]',
    borderGlow: 'hover:shadow-emerald-500/40 border-emerald-500/60 dark:border-emerald-400/50',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    icon: <Network className="w-5 h-5 text-emerald-500" />,
    tags: ['SysAdmin', 'LAN & Wi-Fi Setup', 'Cybersecurity']
  },
  {
    id: 'Programming Committee',
    name: 'Programming Committee',
    shortName: 'Programming',
    description: 'Leading web & mobile development, competitive coding, hackathons, API integrations, and code reviews.',
    logo: '/imgs/Committees/Programming/Logo.png',
    accentColor: 'from-[#d946ef] to-[#c026d3]',
    borderGlow: 'hover:shadow-fuchsia-500/40 border-fuchsia-500/60 dark:border-fuchsia-400/50',
    badgeBg: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/30',
    icon: <Code2 className="w-5 h-5 text-fuchsia-500" />,
    tags: ['Web & Mobile', 'Competitive Coding', 'Hackathons']
  }
];

interface CommitteeRibbonsProps {
  onSelectCommittee: (committeeName: string) => void;
}

export default function CommitteeRibbons({ onSelectCommittee }: CommitteeRibbonsProps) {
  return (
    <section id="committees" className="relative w-full bg-[#e5e5df] dark:bg-[#121215] pt-20 pb-20 px-4 mt-20 transition-colors">
      
      {/* Central CSO Logo Badge */}
      <div className="absolute -top-16 sm:-top-20 left-1/2 -translate-x-1/2 z-20">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-3 sm:p-4 bg-[#E5E5DF] dark:bg-[#121215] flex items-center justify-center">
          <img 
            src="/imgs/CSOLOGO.png" 
            alt="CSO Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* "Committees" Text Label centered right below the logo badge */}
      <div className="text-center mt-6 mb-10">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Committees
        </h3>
      </div>

      {/* 4 Committee Banner Ribbons Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
        {COMMITTEES.map((comm) => (
          <div
            key={comm.id}
            onClick={() => onSelectCommittee(comm.id)}
            className={`ribbon-banner cursor-pointer relative bg-[#fafaf8] dark:bg-[#18181b] border-2 rounded-t-xl p-6 pb-16 shadow-xl flex flex-col items-center text-center transition-all group ${comm.borderGlow}`}
          >
            {/* Top Color Accent Line matching logo */}
            <div className={`absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r ${comm.accentColor} rounded-t-xl`} />

            {/* Circular Logo Container with Gold Ring Outer Border */}
            <div className="relative mt-2 mb-4 w-24 h-24 sm:w-28 sm:h-28 rounded-full p-2 bg-[#f0f0eb] dark:bg-[#27272a] border-4 border-amber-400 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
              <img
                src={comm.logo}
                alt={`${comm.name} Logo`}
                className="w-full h-full object-contain drop-shadow"
              />
            </div>

            {/* Committee Title */}
            <h4 className="text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center justify-center gap-1.5 mt-1">
              {comm.shortName}
            </h4>

            {/* Sub-badge */}
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md border mt-2 ${comm.badgeBg}`}>
              {comm.icon} {comm.name}
            </span>

            {/* Committee Brief */}
            <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-3 leading-relaxed flex-1 font-medium">
              {comm.description}
            </p>

            {/* Skills & Tag Chips */}
            <div className="mt-4 flex flex-wrap justify-center gap-1">
              {comm.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#e8e8e3] dark:bg-[#27272a] text-neutral-800 dark:text-neutral-300 border border-[#d5d5cf] dark:border-[#3f3f46]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA Arrow Button */}
            <div className="mt-5 pt-3 border-t border-neutral-200 dark:border-[#27272a] w-full flex items-center justify-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Join {comm.shortName} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
