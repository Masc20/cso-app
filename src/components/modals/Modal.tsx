'use client';

import { useEffect } from 'react';
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

  const hasMaxWidth = className.includes('max-w-');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      {/* Backdrop overlay click handler */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className={`relative w-full ${hasMaxWidth ? '' : 'max-w-lg'} max-h-[92dvh] sm:max-h-[88vh] bg-cso-card border-2 border-cso rounded-2xl shadow-2xl overflow-hidden z-10 animate-scale-up my-auto flex flex-col ${className}`}>
        {title && (
          <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-cso bg-[#f4f4f2]/50 dark:bg-[#18181b]/50">
            <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-neutral-100 truncate pr-2">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-[#27272a] transition-colors shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0 flex flex-col">{children}</div>
      </div>
    </div>
  );
}
