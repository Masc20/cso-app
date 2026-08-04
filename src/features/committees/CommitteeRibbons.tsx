'use client';

import React from 'react';
import { Palette, Gamepad2, Network, Code2, ArrowRight } from 'lucide-react';
import type { CommitteeRibbonsProps } from './types';
import { COMMITTEES } from '@/data';

export default function CommitteeRibbons({ onSelectCommittee }: CommitteeRibbonsProps) {
  const getIcon = (shortName: string) => {
    switch (shortName) {
      case 'G.A.D':
      case 'G.A.D Committee':
        return <Palette className="w-5 h-5 text-amber-500" />;
      case 'Gaming':
        return <Gamepad2 className="w-5 h-5 text-emerald-500" />;
      case 'Networking':
        return <Network className="w-5 h-5 text-sky-500" />;
      default:
        return <Code2 className="w-5 h-5 text-fuchsia-500" />;
    }
  };

  const getBorderBg = (id: string) => {
    switch (id) {
      case 'G.A.D Committee':
      case 'G.A.D':
        return 'bg-amber-500/60 dark:bg-amber-400/50 group-hover:bg-amber-500';
      case 'Gaming Committee':
        return 'bg-emerald-500/60 dark:bg-emerald-400/50 group-hover:bg-emerald-500';
      case 'Networking Committee':
        return 'bg-sky-500/60 dark:bg-sky-400/50 group-hover:bg-sky-500';
      default:
        return 'bg-fuchsia-500/60 dark:bg-fuchsia-400/50 group-hover:bg-fuchsia-500';
    }
  };

  return (
    <section id="committees" className="relative w-full bg-[#e5e5df] dark:bg-[#121215] pt-20 pb-20 px-4 mt-20 transition-colors border-y border-[#d0d0c8] dark:border-[#27272a]">
      
      {/* Central CSO Logo Badge Floating at the Center Header */}
      <div className="absolute -top-16 sm:-top-20 left-1/2 -translate-x-1/2 z-20">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-3 sm:p-4 bg-[#e5e5df] dark:bg-[#121215] flex items-center justify-center">
          <img 
            src="/imgs/CSOLOGO.png" 
            alt="CSO Logo Badge" 
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* "Committees" Title Label centered right below the central logo badge */}
      <div className="text-center mt-6 mb-10">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Committees
        </h3>
        <p className="text-xs sm:text-sm font-bold text-neutral-500 dark:text-neutral-400 mt-1 uppercase tracking-widest">
          Specialized Wings & Divisions
        </p>
      </div>

      {/* 4 Committee Banner Ribbons Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
        {COMMITTEES.map((comm) => (
          <div
            key={comm.id}
            onClick={() => onSelectCommittee(comm.id)}
            className="ribbon-banner cursor-pointer group relative p-[2px] rounded-t-xl transition-all"
          >
            {/* Outer Clipped Border Container Layer (Ensures V-shaped bottom edge has crisp border color) */}
            <div className={`ribbon-clip w-full h-full p-[2px] rounded-t-xl transition-colors ${getBorderBg(comm.id)}`}>
              
              {/* Inner Card Content Container */}
              <div className="ribbon-clip w-full h-full bg-cso-card rounded-t-xl p-6 pb-16 flex flex-col items-center text-center relative overflow-hidden">
                
                {/* Top Color Accent Line matching logo */}
                <div className={`absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r ${comm.accentColor} rounded-t-xl`} />

                {/* Circular Logo Container with Gold Ring Outer Border */}
                <div className="relative mt-2 mb-4 w-24 h-24 sm:w-28 sm:h-28 rounded-full p-2 bg-cso-input border-4 border-amber-400 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
                  <img
                    src={comm.logo}
                    alt={`${comm.name} Logo`}
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>

                {/* Committee Short Title */}
                <h4 className="text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center justify-center gap-1.5 mt-1">
                  {comm.shortName}
                </h4>

                {/* Sub-badge */}
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-md border mt-2 ${comm.badgeBg}`}>
                  {getIcon(comm.shortName)} {comm.name}
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
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-cso-input text-neutral-800 dark:text-neutral-300 border border-cso"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Arrow Button */}
                <div className="mt-5 pt-3 border-t border-cso w-full flex items-center justify-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Join {comm.shortName} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>

              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
