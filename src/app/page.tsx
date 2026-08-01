'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroCSO from '@/components/layout/HeroCSO';
import Footer from '@/components/layout/Footer';
import CommitteeRibbons from '@/features/committees/CommitteeRibbons';
import MediaCarousel from '@/features/gallery/MediaCarousel';
import RegistrationPortal from '@/features/registration/RegistrationPortal';
import { useDarkMode } from '@/hooks/useDarkMode';

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
    <div className={`min-h-screen w-full flex flex-col selection:bg-amber-500 selection:text-white bg-[#f2f2ef] text-slate-900 dark:bg-[#090a0f] dark:text-slate-100 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      
      {/* Top Navbar */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Content Sections */}
      <main className="flex-1 w-full">
        
        {/* CSO Title */}
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
