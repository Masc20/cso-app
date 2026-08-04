'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { CommitteeRibbonsProps } from './types';
import { COMMITTEES } from '@/data';

export default function CommitteeRibbons({ onSelectCommittee }: CommitteeRibbonsProps) {
  return (
    <section id="committees" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Specialized Wings & Divisions
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
          Explore Our Committees
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-3 font-medium">
          Select your passion. From competitive game development to cyber infrastructure and full-stack engineering, find where you belong.
        </p>
      </div>

      {/* 4 Committee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {COMMITTEES.map((comm) => {
          const IconComp = comm.Icon;
          return (
            <div
              key={comm.id}
              className={`bg-cso-card border border-cso rounded-xl p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between group relative overflow-hidden ${comm.borderGlow}`}
            >
              
              {/* Top Ambient Glow Gradient */}
              <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br ${comm.accentColor} opacity-10 group-hover:opacity-20 blur-2xl transition-opacity pointer-events-none`} />

              <div>
                {/* Header: Logo Image + Category Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cso-input p-1.5 border border-cso shadow-inner shrink-0 flex items-center justify-center">
                    <img
                      src={comm.logo}
                      alt={`${comm.name} Logo`}
                      className="w-full h-full object-contain drop-shadow"
                    />
                  </div>
                  <IconComp className={`w-6 h-6 ${comm.iconClassName}`} />
                </div>

                {/* Title & Short Name Badge */}
                <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider mb-2 border ${comm.badgeBg}`}>
                  {comm.shortName}
                </span>

                <h3 className="text-lg font-black text-neutral-900 dark:text-neutral-100 group-hover:text-amber-500 transition-colors">
                  {comm.name}
                </h3>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed font-medium">
                  {comm.description}
                </p>

                {/* Skill Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-cso">
                  {comm.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cso-input text-neutral-700 dark:text-neutral-300 border border-cso"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Apply Button */}
              <button
                onClick={() => onSelectCommittee(comm.id)}
                className="w-full mt-6 py-2.5 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-[#27272a] dark:hover:bg-[#3f3f46] dark:text-neutral-100 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all group-hover:bg-amber-500 group-hover:text-white dark:group-hover:bg-amber-500 shadow-md min-h-[36px]"
              >
                <span>Apply for {comm.shortName}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>
          );
        })}
      </div>

    </section>
  );
}
