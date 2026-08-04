'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles, Menu, X, Users } from 'lucide-react';
import { NAV_LINKS, OFFICIAL_SOCIAL_LINKS } from '@/data';

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

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false);
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${
        scrolled 
          ? 'shadow-md py-3 backdrop-blur-md bg-cso-card/90 text-neutral-900 dark:text-neutral-100 border-cso' 
          : 'py-4 bg-cso-card text-neutral-900 dark:text-neutral-100 border-cso'
      }`}
    >
      <div className="w-full px-6 sm:px-10 md:px-14 flex items-center justify-between">
        
        {/* Brand Logo & Name (Left) */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-lg bg-cso-input flex items-center justify-center p-1 border border-cso group-hover:scale-105 transition-transform shrink-0">
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
            {NAV_LINKS.map((link) => {
              if (link.href === '#register') {
                return (
                  <button 
                    key={link.name}
                    onClick={() => scrollToSection(link.href)} 
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2 rounded-md transition-all transform hover:scale-105 shadow-md text-xs uppercase tracking-wider min-h-[36px]"
                  >
                    {link.name}
                  </button>
                );
              }

              return (
                <button 
                  key={link.name}
                  onClick={() => scrollToSection(link.href)} 
                  className="hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1.5 py-1 text-neutral-800 dark:text-neutral-200 font-bold"
                >
                  {link.href === '#committees' && <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  {link.href === '#gallery' && <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Official CSO Facebook Button */}
          <a
            href={OFFICIAL_SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg bg-[#1877f2]/10 hover:bg-[#1877f2]/20 text-[#1877f2] dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20 border border-[#1877f2]/20 dark:border-sky-500/30 focus:outline-none shadow-sm flex items-center justify-center min-w-[36px] min-h-[36px]"
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
            className="p-2.5 rounded-lg bg-cso-input text-neutral-800 dark:text-neutral-200 border border-cso focus:outline-none shadow-sm min-w-[36px] min-h-[36px] flex items-center justify-center"
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
            className="md:hidden p-2.5 rounded-lg bg-cso-input text-neutral-800 dark:text-neutral-200 border border-cso focus:outline-none min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cso-card border-t border-cso px-6 pt-3 pb-6 space-y-3">
          {NAV_LINKS.map((link) => (
            <button 
              key={link.name}
              onClick={() => scrollToSection(link.href)} 
              className={`block w-full text-left py-2 px-3 rounded-md font-semibold ${
                link.href === '#register'
                  ? 'bg-emerald-600 text-white text-center font-extrabold uppercase text-xs'
                  : 'hover:bg-cso-input text-neutral-800 dark:text-neutral-200'
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
