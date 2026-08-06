'use client';

import { useState, useEffect } from 'react';
import { Palette, Gamepad2, Network, Code2, ArrowRight, Play } from 'lucide-react';
import type { CommitteeRibbonsProps, Committee } from '@/types';
import { CommitteeVideoModal } from '@/components/modals';
import { fetchCommittees } from '@/features/admin';
import { RibbonSkeleton } from '@/lib/utils/skeleton'

export default function CommitteeRibbons({ onSelectCommittee }: CommitteeRibbonsProps) {
  const [selectedVideoCommittee, setSelectedVideoCommittee] = useState<Committee | null>(null);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDynamicCommittees = async () => {
      setLoading(true);
      try {
        const liveCommittees = await fetchCommittees(false); // Active only
        if (liveCommittees && liveCommittees.length > 0) {
          setCommittees(liveCommittees);
        }
      } catch (err) {
        console.warn('Failed to load dynamic committees:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDynamicCommittees();
  }, []);

  const getCommitteeStyles = (comm: Committee) => {
    const name = (comm.name || comm.id || '').toLowerCase();
    
    if (name.includes('g.a.d') || name.includes('gad')) {
      return {
        icon: <Palette className="w-5 h-5 text-amber-500" />,
        borderBg: 'bg-amber-500/60 dark:bg-amber-400/50 group-hover:bg-amber-500',
        hoverGlow: 'group-hover:drop-shadow-[0_15px_30px_rgba(245,158,11,0.45)] dark:group-hover:drop-shadow-[0_15px_35px_rgba(245,158,11,0.6)]',
        accentLine: 'from-[#f59e0b] via-[#ec4899] to-[#10b981]',
        ctaText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
        badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
      };
    }
    
    if (name.includes('gaming')) {
      return {
        icon: <Gamepad2 className="w-5 h-5 text-emerald-500" />,
        borderBg: 'bg-emerald-500/60 dark:bg-emerald-400/50 group-hover:bg-emerald-500',
        hoverGlow: 'group-hover:drop-shadow-[0_15px_30px_rgba(16,185,129,0.45)] dark:group-hover:drop-shadow-[0_15px_35px_rgba(16,185,129,0.6)]',
        accentLine: 'from-[#10b981] to-[#059669]',
        ctaText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
        badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
      };
    }

    if (name.includes('networking')) {
      return {
        icon: <Network className="w-5 h-5 text-sky-500" />,
        borderBg: 'bg-sky-500/60 dark:bg-sky-400/50 group-hover:bg-sky-500',
        hoverGlow: 'group-hover:drop-shadow-[0_15px_30px_rgba(14,165,233,0.45)] dark:group-hover:drop-shadow-[0_15px_35px_rgba(14,165,233,0.6)]',
        accentLine: 'from-[#0ea5e9] to-[#0284c7]',
        ctaText: 'group-hover:text-sky-600 dark:group-hover:text-sky-400',
        badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30'
      };
    }

    if (name.includes('programming')) {
      return {
        icon: <Code2 className="w-5 h-5 text-fuchsia-500" />,
        borderBg: 'bg-fuchsia-500/60 dark:bg-fuchsia-400/50 group-hover:bg-fuchsia-500',
        hoverGlow: 'group-hover:drop-shadow-[0_15px_30px_rgba(217,70,239,0.45)] dark:group-hover:drop-shadow-[0_15px_35px_rgba(217,70,239,0.6)]',
        accentLine: 'from-[#d946ef] to-[#c026d3]',
        ctaText: 'group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400',
        badgeBg: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/30'
      };
    }

    return {
      icon: <Code2 className="w-5 h-5 text-sky-500" />,
      borderBg: 'bg-sky-500/60 dark:bg-sky-400/50 group-hover:bg-sky-500',
      hoverGlow: 'group-hover:drop-shadow-[0_15px_30px_rgba(14,165,233,0.45)] dark:group-hover:drop-shadow-[0_15px_35px_rgba(14,165,233,0.6)]',
      accentLine: comm.accentColor || 'from-sky-500 to-sky-600',
      ctaText: 'group-hover:text-sky-600 dark:group-hover:text-sky-400',
      badgeBg: comm.badgeBg || 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30'
    };
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

      {/* Dynamic Active Committee Banner Ribbons Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
        {loading || committees.length === 0 ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <RibbonSkeleton key={idx} />
          ))
        ) : (
          committees.map((comm) => {
            const styles = getCommitteeStyles(comm);

            return (
              <div
                key={comm.id}
                onClick={() => onSelectCommittee(comm.name || comm.id)}
                className={`ribbon-banner cursor-pointer group relative p-[2px] rounded-t-xl transition-all ${styles.hoverGlow}`}
              >
                {/* Outer Clipped Border Container Layer */}
                <div className={`ribbon-clip w-full h-full p-[0.5px] rounded-t-xl transition-colors ${styles.borderBg}`}>
                  
                  {/* Inner Card Content Container */}
                  <div className="ribbon-clip w-full h-full bg-cso-card rounded-t-xl p-6 pb-16 flex flex-col items-center text-center relative overflow-hidden">
                    
                    {/* Top Color Accent Line matching logo */}
                    <div className={`absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r ${styles.accentLine} rounded-t-xl`} />

                    {/* Circular Logo Container */}
                    <div className="relative mt-2 mb-3 w-24 h-24 sm:w-28 sm:h-28 rounded-full p-2 bg-cso-input shadow-md group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
                      <img
                        src={comm.logo || '/imgs/CSOLOGO.png'}
                        alt={`${comm.name} Logo`}
                        onError={(e) => {
                          (e.target as HTMLElement).setAttribute('src', '/imgs/CSOLOGO.png');
                        }}
                        className="w-full h-full object-contain drop-shadow"
                      />
                    </div>

                    {/* Watch Intro Video Trigger Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVideoCommittee(comm);
                      }}
                      className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all shadow-sm z-10"
                    >
                      <Play className="w-3 h-3 fill-current" /> Intro Video
                    </button>

                    {/* Committee Short Title */}
                    <h4 className="text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center justify-center gap-1.5">
                      {comm.shortName || comm.short_name}
                    </h4>

                    {/* Sub-badge */}
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-md border mt-2 ${styles.badgeBg}`}>
                      {styles.icon} {comm.name}
                    </span>

                    {/* Committee Brief */}
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-3 leading-relaxed flex-1 font-medium">
                      {comm.description}
                    </p>

                    {/* Skills & Tag Chips */}
                    <div className="mt-4 flex flex-wrap justify-center gap-1">
                      {(comm.tags || []).map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-cso-input text-neutral-800 dark:text-neutral-300 border border-cso"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA Arrow Button */}
                    <div className={`mt-5 pt-3 border-t border-cso w-full flex items-center justify-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 ${styles.ctaText} transition-colors`}>
                      Join {comm.shortName || comm.short_name} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Centralized Committee Video Modal Primitive */}
      <CommitteeVideoModal
        isOpen={Boolean(selectedVideoCommittee)}
        committee={selectedVideoCommittee}
        onClose={() => setSelectedVideoCommittee(null)}
        onApply={(committeeId) => onSelectCommittee(committeeId)}
      />

    </section>
  );
}
