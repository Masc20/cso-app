'use client';

import React, { useEffect, useRef } from 'react';

interface ExtendedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, children, className = '' }: ExtendedModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  // 1. Close on 'Esc' key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Lock background scrolling
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
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing
        className={`bg-[#fafaf8] dark:bg-[#18181b] border border-[#e0e0da] dark:border-[#27272a] w-full rounded-xl shadow-2xl relative my-8 animate-scale-up ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
