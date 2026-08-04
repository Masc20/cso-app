'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Info, X, AlertCircle } from 'lucide-react';
import type { FloatingInputProps } from './types';

export default function FloatingInput({
  label,
  icon,
  infoTooltip,
  errorMessage,
  value,
  onChange,
  onFocus,
  onBlur,
  type = 'text',
  required,
  className = '',
  id,
  ...props
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
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

  const hasError = Boolean(errorMessage);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        {icon && (
          <div className={`absolute left-3.5 z-10 pointer-events-none ${hasError ? 'text-rose-500' : 'text-neutral-400 dark:text-neutral-500'}`}>
            {icon}
          </div>
        )}
        
        <input
          {...props}
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={(e) => {
            setIsFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          required={required}
          placeholder=" "
          className={`peer w-full rounded-lg bg-cso-input border text-neutral-900 dark:text-neutral-100 text-sm pt-5 pb-2.5 shadow-sm transition-all ${
            icon ? 'pl-10 pr-10' : 'pl-4 pr-10'
          } ${
            hasError
              ? 'border-rose-500 ring-2 ring-rose-500/30 focus:border-rose-500 focus:ring-rose-500/50'
              : 'border-cso focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500'
          } ${className}`}
        />

        <label
          htmlFor={id}
          style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          className={`absolute pointer-events-none origin-top-left ${
            icon ? 'left-10' : 'left-4'
          } ${
            isFloating
              ? `top-1.5 text-[10px] font-extrabold tracking-wide ${hasError ? 'text-rose-500' : 'text-amber-600 dark:text-amber-400'}`
              : `top-3.5 text-sm font-semibold ${hasError ? 'text-rose-400' : 'text-neutral-500 dark:text-neutral-400'}`
          } peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-extrabold peer-autofill:top-1.5 peer-autofill:text-[10px]`}
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>

        {/* Info Popover Icon Trigger */}
        {infoTooltip && (
          <button
            type="button"
            onClick={() => setShowTooltip(prev => !prev)}
            aria-label={`Information for ${label}`}
            className="absolute right-3.5 z-10 text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors p-1 rounded-full focus:outline-none"
            title="Click for format help"
          >
            {showTooltip ? <X className="w-3.5 h-3.5 text-rose-500" /> : <Info className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Inline Field Error Message */}
      {hasError && (
        <p className="text-[11px] font-bold text-rose-500 mt-1 flex items-center gap-1 leading-tight animate-fade-in">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{errorMessage}</span>
        </p>
      )}

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
