'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Info, X, ChevronDown } from 'lucide-react';

interface OptionItem {
  value: string;
  label: string;
}

interface FloatingSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: (OptionItem | string | [string, string])[];
  placeholderOption?: string;
  icon?: React.ReactNode;
  infoTooltip?: string;
}

export default function FloatingSelect({
  label,
  options,
  placeholderOption = '-- Select --',
  icon,
  infoTooltip,
  value,
  onChange,
  required,
  className = '',
  ...props
}: FloatingSelectProps) {
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
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 z-10 text-neutral-400 dark:text-neutral-500 pointer-events-none">
            {icon}
          </div>
        )}

        <select
          {...props}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className={`peer w-full rounded-lg bg-cso-input border border-cso text-sm pt-5 pb-2.5 shadow-sm appearance-none ${
            !hasValue && !isFocused ? 'text-transparent' : 'text-neutral-900 dark:text-neutral-100'
          } ${
            icon ? 'pl-10 pr-10' : 'pl-4 pr-10'
          } focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 ${className}`}
        >
          <option value="" disabled className="text-neutral-400 font-sans">
            {placeholderOption}
          </option>
          {options.map((opt, idx) => {
            if (Array.isArray(opt)) {
              return (
                <option key={opt[0]} value={opt[0]} className="text-neutral-900 dark:text-neutral-100 bg-[#fafaf8] dark:bg-[#18181b]">
                  {opt[1]}
                </option>
              );
            }
            if (typeof opt === 'object' && opt !== null) {
              return (
                <option key={opt.value || idx} value={opt.value} className="text-neutral-900 dark:text-neutral-100 bg-[#fafaf8] dark:bg-[#18181b]">
                  {opt.label}
                </option>
              );
            }
            return (
              <option key={opt} value={opt} className="text-neutral-900 dark:text-neutral-100 bg-[#fafaf8] dark:bg-[#18181b]">
                {opt}
              </option>
            );
          })}
        </select>

        {/* Floating Label */}
        <label
          style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          className={`absolute pointer-events-none origin-top-left ${
            icon ? 'left-10' : 'left-4'
          } ${
            isFloating
              ? 'top-1.5 text-[10px] font-extrabold tracking-wide text-amber-600 dark:text-amber-400'
              : 'top-3.5 text-sm font-semibold text-neutral-500 dark:text-neutral-400'
          }`}
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>

        {/* Right Action Icons: Chevron Arrow & Info Tooltip Trigger */}
        <div className="absolute right-3.5 z-10 flex items-center gap-1.5 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
        </div>

        {infoTooltip && (
          <button
            type="button"
            onClick={() => setShowTooltip(prev => !prev)}
            aria-label={`Information for ${label}`}
            className="absolute right-8 z-10 text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors p-1 rounded-full focus:outline-none"
            title="Click for format help"
          >
            {showTooltip ? <X className="w-3.5 h-3.5 text-rose-500" /> : <Info className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Floating Info Tooltip Card */}
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
