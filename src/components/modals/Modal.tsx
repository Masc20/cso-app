'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import type { ModalProps } from '@/types';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = ''
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div className={`relative w-full max-w-lg bg-cso-card border-2 border-cso rounded-xl shadow-2xl overflow-hidden z-10 animate-scale-up ${className}`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-cso bg-[#f4f4f2]/50 dark:bg-[#18181b]/50">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-[#27272a] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
