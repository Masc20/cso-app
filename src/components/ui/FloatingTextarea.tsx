'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Info, X } from 'lucide-react';

interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  infoTooltip?: string;
}

export default function FloatingTextarea({
  label,
  infoTooltip,
  value,
  onChange,
  required,
  rows = 3,
  className = '',
  ...props
}: FloatingTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasValue = value !== undefined && value !== null && String(value).trim() !== '';
  const isFloating = isFocused || hasValue;

  // Auto-dismiss tooltip on click outside or 'Esc' key press
  useEffect(() => {
    if (!showTooltip) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowTooltip(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showTooltip]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <textarea
          {...props}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          rows={rows}
          placeholder=""
          className={`peer w-full rounded-lg bg-white dark:bg-[#18181b] border border-neutral-300 dark:border-[#27272a] text-neutral-900 dark:text-neutral-100 text-sm pt-6 pb-2.5 pl-4 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 ${className}`}
        />

        <label
          style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          className={`absolute left-4 pointer-events-none origin-top-left ${
            isFloating
              ? 'top-1.5 text-[10px] font-extrabold tracking-wide text-amber-600 dark:text-amber-400'
              : 'top-3.5 text-sm font-semibold text-neutral-500 dark:text-neutral-400'
          }`}
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>

        {/* Info Popover Icon Trigger */}
        {infoTooltip && (
          <button
            type="button"
            onClick={() => setShowTooltip(prev => !prev)}
            aria-label={`Information for ${label}`}
            className="absolute right-3.5 top-3.5 z-10 text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors p-1 rounded-full focus:outline-none"
            title="Click for format help"
          >
            {showTooltip ? <X className="w-3.5 h-3.5 text-rose-500" /> : <Info className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Floating Info Tooltip Card (Absolute Positioned — Auto-dismisses on Outside Click) */}
      {infoTooltip && showTooltip && (
        <div className="absolute left-0 top-full mt-1.5 w-full z-30 p-2.5 rounded-lg bg-neutral-900 text-white dark:bg-[#27272a] dark:text-neutral-100 text-[11px] font-medium shadow-2xl border border-neutral-700 dark:border-[#3f3f46] flex items-start justify-between gap-2 animate-fade-in pointer-events-auto">
          <div className="flex items-start gap-1.5">
            <span className="text-amber-400 font-bold shrink-0">💡 Hint:</span>
            <span>{infoTooltip}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="text-neutral-400 hover:text-white shrink-0 p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
