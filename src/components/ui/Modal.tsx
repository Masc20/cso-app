'use client';

import React, { useEffect, useRef } from 'react';

interface ExtendedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, title, children, className = '' }: ExtendedModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  // 1. Close on 'Esc' key press & lock background scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 2. Close on click outside (backdrop click)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing
        className={`bg-cso-card border border-cso w-full max-w-lg rounded-xl shadow-2xl relative my-auto animate-scale-up p-5 sm:p-6 ${className}`}
      >
        {title && (
          <div className="pb-3 mb-4 border-b border-cso flex items-center justify-between">
            <h3 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-1 rounded-md"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
