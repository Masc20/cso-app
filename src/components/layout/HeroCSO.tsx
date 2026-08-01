'use client';

import React from 'react';

export default function HeroCSO() {
  return (
    <section className="relative w-full pt-8 pb-4 flex flex-col items-center text-center bg-[#f4f4f2] dark:bg-[#09090b] transition-colors">
      {/* Title Header */}
      <div className="relative w-full max-w-5xl px-4 flex flex-col items-center">
        <h1 className="text-7xl sm:text-9xl md:text-[11rem] font-black tracking-widest text-neutral-900 dark:text-neutral-100 leading-none">
          CSO
        </h1>
        <p className="text-xs sm:text-sm font-bold text-neutral-600 dark:text-neutral-400 mt-2 uppercase tracking-widest">
          Computer Studies Organization &bull; ACLC College Of Mandaue
        </p>
      </div>
    </section>
  );
}
