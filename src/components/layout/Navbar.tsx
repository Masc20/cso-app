'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles, Menu, X, Users } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onSelectCommittee?: (name: string) => void;
}

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b ${
        scrolled 
          ? 'shadow-md py-3 backdrop-blur-md bg-[#fafaf8]/95 text-neutral-900 border-[#e0e0da] dark:bg-[#09090b]/95 dark:text-neutral-100 dark:border-[#27272a]' 
          : 'py-4 bg-[#fafaf8] text-neutral-900 border-[#e0e0da] dark:bg-[#09090b] dark:text-neutral-100 dark:border-[#27272a]'
      }`}
    >
      <div className="w-full px-6 sm:px-10 md:px-14 flex items-center justify-between">
        
        {/* Brand Logo & Name (Left) */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-lg bg-[#ebebe8] dark:bg-[#18181b] flex items-center justify-center p-1 border border-neutral-300 dark:border-[#27272a] group-hover:scale-105 transition-transform">
            <img 
              src="/imgs/CSOLOGO.png" 
              alt="CSO Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="font-extrabold text-base sm:text-lg tracking-wider text-neutral-900 dark:text-neutral-100 leading-none group-hover:text-amber-600 dark:group-hover:text-amber-400">
              CSO
            </div>
            <div className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-medium tracking-wide uppercase">
              Computer Studies Organization
            </div>
          </div>
        </div>

        {/* Grouped Nav Buttons, Facebook Link, & Theme Toggle (Right) */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Nav Buttons */}
          <nav className="hidden md:flex items-center space-x-5 font-medium text-sm">
            <button 
              onClick={() => scrollToSection('committees')} 
              className="hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1.5 py-1 text-neutral-800 dark:text-neutral-200 font-bold"
            >
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Committees
            </button>
            <button 
              onClick={() => scrollToSection('gallery')} 
              className="hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1.5 py-1 text-neutral-800 dark:text-neutral-200 font-bold"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Media Gallery
            </button>
            <button 
              onClick={() => scrollToSection('register')} 
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2 rounded-md transition-all transform hover:scale-105 shadow-md text-xs uppercase tracking-wider"
            >
              Register Now
            </button>
          </nav>

          {/* Official CSO Facebook Button */}
          <a
            href="https://www.facebook.com/profile.php?id=100094218363222"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg bg-[#1877f2]/10 hover:bg-[#1877f2]/20 text-[#1877f2] dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20 border border-[#1877f2]/20 dark:border-sky-500/30 focus:outline-none shadow-sm flex items-center justify-center"
            title="Official CSO Facebook Page"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(prev => !prev)}
            aria-label="Toggle Light & Dark Mode"
            className="p-2.5 rounded-lg bg-[#ebebe8] dark:bg-[#18181b] hover:bg-[#e0e0da] dark:hover:bg-[#27272a] text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-[#27272a] focus:outline-none shadow-sm"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-neutral-800" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 rounded-lg bg-[#ebebe8] dark:bg-[#18181b] text-neutral-800 dark:text-neutral-200 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fafaf8] dark:bg-[#121215] border-t border-[#e0e0da] dark:border-[#27272a] px-6 pt-3 pb-6 space-y-3">
          <button 
            onClick={() => scrollToSection('committees')} 
            className="block w-full text-left py-2 px-3 rounded-md hover:bg-[#ebebe8] dark:hover:bg-[#18181b] text-neutral-800 dark:text-neutral-200 font-semibold"
          >
            Committees
          </button>
          <button 
            onClick={() => scrollToSection('gallery')} 
            className="block w-full text-left py-2 px-3 rounded-md hover:bg-[#ebebe8] dark:hover:bg-[#18181b] text-neutral-800 dark:text-neutral-200 font-semibold"
          >
            Media Gallery
          </button>
          <button 
            onClick={() => scrollToSection('register')} 
            className="block w-full text-center py-2.5 px-4 bg-emerald-600 text-white font-extrabold rounded-md uppercase text-xs"
          >
            Register Now
          </button>
        </div>
      )}
    </header>
  );
}
