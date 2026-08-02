'use client';

import React, { useState } from 'react';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export default function FloatingInput({
  label,
  icon,
  value,
  onChange,
  type = 'text',
  required,
  className = '',
  ...props
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim() !== '';

  const isFloating = isFocused || hasValue;

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 z-10 text-neutral-400 dark:text-neutral-500 pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          {...props}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          placeholder=""
          className={`peer w-full rounded-lg bg-white dark:bg-[#18181b] border border-neutral-300 dark:border-[#27272a] text-neutral-900 dark:text-neutral-100 text-sm pt-5 pb-2.5 shadow-sm ${
            icon ? 'pl-10 pr-4' : 'px-4'
          } focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all ${className}`}
        />

        <label
          className={`absolute pointer-events-none transition-all duration-200 ease-out origin-top-left ${
            icon ? 'left-10' : 'left-4'
          } ${
            isFloating
              ? 'top-1.5 text-[10px] font-extrabold tracking-wide uppercase text-amber-600 dark:text-amber-400'
              : 'top-3.5 text-sm font-semibold text-neutral-500 dark:text-neutral-400'
          }`}
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      </div>
    </div>
  );
}
