'use client';

import React, { useState, useEffect, useCallback, TouchEvent } from 'react';
import { Trophy, Award, Camera, ChevronLeft, ChevronRight, Pause, Play, Maximize2, X, Users } from 'lucide-react';
import { MEDIA_ITEMS } from '@/data/mediaGallery';

export default function MediaCarousel() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const filteredItems = activeCategory === 'All'
    ? MEDIA_ITEMS
    : MEDIA_ITEMS.filter(item => item.category === activeCategory);

  // Auto-slide effect
  useEffect(() => {
    if (!isPlaying || isZoomed || filteredItems.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filteredItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, isZoomed, filteredItems.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  }, [filteredItems.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % filteredItems.length);
  }, [filteredItems.length]);

  // Touch Swipe Gesture Handlers for Mobile
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext(); // Swiped Left -> Next
      else handlePrev();          // Swiped Right -> Prev
    }
    setTouchStartX(null);
  };

  // Keyboard Navigation for Fullscreen & Carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomed) {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'Escape') setIsZoomed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed, handlePrev, handleNext]);

  const currentItem = filteredItems[currentIndex] || MEDIA_ITEMS[0];

  return (
    <section id="gallery" className="w-full py-12 overflow-hidden bg-[#f4f4f2] dark:bg-[#09090b] border-y border-[#e0e0da] dark:border-[#27272a]">
      
      <div className="max-w-7xl mx-auto px-4 text-center mb-8">
        <span className="text-xs uppercase tracking-widest font-black text-amber-600 dark:text-amber-400">
          Highlights & Achievements
        </span>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-1">
          CSO Media Gallery
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl mx-auto font-medium">
          Full-screen showcase of documented activities, competition awards, student certifications, and executive leadership.
        </p>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {['All', 'Activities', 'Awards', 'Certificates', 'Officers'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentIndex(0);
              }}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs font-bold border ${
                activeCategory === cat
                  ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-100 shadow-md'
                  : 'bg-[#fafaf8] text-neutral-800 border-neutral-300 dark:bg-[#18181b] dark:text-neutral-300 dark:border-[#27272a] hover:border-neutral-400'
              }`}
            >
              {cat === 'Activities' && <Camera className="w-3.5 h-3.5 inline mr-1 text-emerald-600 dark:text-emerald-400" />}
              {cat === 'Awards' && <Trophy className="w-3.5 h-3.5 inline mr-1 text-amber-500" />}
              {cat === 'Certificates' && <Award className="w-3.5 h-3.5 inline mr-1 text-emerald-500" />}
              {cat === 'Officers' && <Users className="w-3.5 h-3.5 inline mr-1 text-fuchsia-500" />}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FULL SCREEN WIDTH CAROUSEL CONTAINER */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full bg-[#121215] dark:bg-[#121215] shadow-2xl border-y border-[#d0d0c8] dark:border-[#27272a] select-none"
      >
        
        {/* Full-width Image Display Frame */}
        <div className="relative h-[55vh] sm:h-[75vh] w-full flex items-center justify-center overflow-hidden bg-[#09090b] dark:bg-[#09090b]">
          
          {/* Ambient Background Blur */}
          <div 
            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 scale-110 pointer-events-none"
            style={{ backgroundImage: `url("${currentItem.src}")` }}
          />

          {/* Main Focused Image */}
          <img
            src={currentItem.src}
            alt={currentItem.title}
            className="relative z-10 max-h-full max-w-full object-contain p-2 sm:p-4 drop-shadow-2xl"
          />

          {/* Top Floating Category Badge */}
          <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-20">
            <span className="px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-bold bg-neutral-900/80 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 shadow-lg">
              {currentItem.category === 'Activities' && <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />}
              {currentItem.category === 'Awards' && <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />}
              {currentItem.category === 'Certificates' && <Award className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />}
              {currentItem.category === 'Officers' && <Users className="w-3 h-3 sm:w-4 sm:h-4 text-fuchsia-400" />}
              {currentItem.category}
            </span>
          </div>

          {/* Zoom Fullscreen Button */}
          <button
            onClick={() => setIsZoomed(true)}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 z-20 p-2 sm:p-3 rounded-lg bg-neutral-900/80 backdrop-blur-md text-white hover:bg-neutral-900 border border-white/20 shadow-lg"
            title="Expand Fullscreen"
          >
            <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Left/Right Arrow Controls */}
          <button
            onClick={handlePrev}
            className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-900 backdrop-blur-md text-white border border-white/20 shadow-2xl items-center justify-center"
            title="Previous Image"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={handleNext}
            className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-900 backdrop-blur-md text-white border border-white/20 shadow-2xl items-center justify-center"
            title="Next Image"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>

        {/* Full-width Caption & Controls Bar */}
        <div className="w-full bg-[#fafaf8] text-neutral-900 border-t border-[#e0e0da] dark:bg-[#18181b] dark:text-white dark:border-[#27272a] px-4 sm:px-12 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {currentItem.title}
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 font-medium">
              {currentItem.subtitle}
            </p>
          </div>

          {/* Auto-play & Progress Count */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(prev => !prev)}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#ebebe8] text-neutral-800 hover:bg-[#e0e0da] border border-neutral-300 dark:bg-[#27272a] dark:text-neutral-200 dark:hover:bg-[#3f3f46] dark:border-[#3f3f46] text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <span className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-300 bg-[#ebebe8] dark:bg-[#27272a] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md border border-neutral-300 dark:border-[#3f3f46] shadow-sm">
              {currentIndex + 1} / {filteredItems.length}
            </span>
          </div>
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {isZoomed && (
        <div 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-3 sm:p-6 select-none"
        >
          
          {/* Top Bar: Title, Count, & Close Button */}
          <div className="w-full flex items-center justify-between z-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold bg-white/10 text-white border border-white/20">
                {currentItem.category}
              </span>
              <span className="text-xs font-mono font-bold text-white/80 bg-white/10 px-2.5 py-1 rounded-md border border-white/15">
                {currentIndex + 1} / {filteredItems.length}
              </span>
            </div>
            <button
              onClick={() => setIsZoomed(false)}
              className="p-2 sm:p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg"
              title="Close Fullscreen (Esc)"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Center Image Display */}
          <div className="relative w-full flex-1 flex items-center justify-center my-2 sm:my-4 overflow-hidden">
            {/* Left Nav Arrow */}
            <button
              onClick={handlePrev}
              className="hidden sm:flex absolute left-6 z-30 p-3.5 rounded-lg bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-2xl backdrop-blur-md items-center justify-center"
              title="Previous Image (Left Arrow)"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Focused Image */}
            <img
              src={currentItem.src}
              alt={currentItem.title}
              className="max-h-[75vh] max-w-[95vw] object-contain rounded-lg shadow-2xl drop-shadow-2xl"
            />

            {/* Right Nav Arrow */}
            <button
              onClick={handleNext}
              className="hidden sm:flex absolute right-6 z-30 p-3.5 rounded-lg bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-2xl backdrop-blur-md items-center justify-center"
              title="Next Image (Right Arrow)"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Bottom Title & Subtitle */}
          <div className="text-center z-20 max-w-2xl px-2 sm:px-4">
            <h4 className="text-sm sm:text-xl font-bold text-white tracking-wide">
              {currentItem.title}
            </h4>
            <p className="text-[11px] sm:text-xs text-white/70 mt-0.5 font-medium">
              {currentItem.subtitle}
            </p>
          </div>

        </div>
      )}
    </section>
  );
}
