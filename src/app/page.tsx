'use client';

import React, { useState } from 'react';
import { Navbar, HeroCSO, Footer } from '@/components/layout';
import { CommitteeRibbons, MediaCarousel, RegistrationPortal } from '@/features';
import { useDarkMode } from '@/hooks';

export default function Home() {
  const { darkMode, setDarkMode } = useDarkMode();
  const [selectedCommittee, setSelectedCommittee] = useState<string>('Programming Committee');

  const handleSelectCommittee = (committeeName: string) => {
    setSelectedCommittee(committeeName);
    const regSection = document.getElementById('register');
    if (regSection) {
      regSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col selection:bg-amber-500 selection:text-white bg-cso-page text-neutral-900 dark:text-neutral-100 ${darkMode ? 'dark' : ''}`}>
      
      {/* Top Navbar */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Content Sections */}
      <main className="flex-1 w-full">
        
        {/* CSO Title Banner */}
        <HeroCSO />

        {/* 4 Committee Banner Ribbons */}
        <CommitteeRibbons onSelectCommittee={handleSelectCommittee} />

        {/* Media Gallery Carousel */}
        <MediaCarousel />

        {/* Supabase Registration Portal */}
        <RegistrationPortal selectedCommittee={selectedCommittee} />

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
