'use client';

import React, { useState } from 'react';

interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export default function FloatingTextarea({
  label,
  value,
  onChange,
  required,
  rows = 3,
  className = '',
  ...props
}: FloatingTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim() !== '';

  const isFloating = isFocused || hasValue;

  return (
    <div className="relative w-full">
      <textarea
        {...props}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        rows={rows}
        placeholder=""
        className={`peer w-full rounded-lg bg-white dark:bg-[#18181b] border border-neutral-300 dark:border-[#27272a] text-neutral-900 dark:text-neutral-100 text-sm pt-6 pb-2.5 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all ${className}`}
      />

      <label
        className={`absolute left-4 pointer-events-none transition-all duration-200 ease-out origin-top-left ${
          isFloating
            ? 'top-1.5 text-[10px] font-extrabold tracking-wide uppercase text-amber-600 dark:text-amber-400'
            : 'top-3.5 text-sm font-semibold text-neutral-500 dark:text-neutral-400'
        }`}
      >
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
    </div>
  );
}
