'use client';

import React from 'react';
import { CheckCircle2, Lock, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'error':
      case 'info':
      default:
        return <Lock className="w-4 h-4" />;
    }
  };

  const getBadgeColor = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500 text-white';
      case 'error':
        return 'bg-rose-500 text-white';
      case 'info':
      default:
        return 'bg-amber-500 text-white';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-2xl border border-neutral-700 dark:border-neutral-300 text-xs font-bold transition-all duration-300 animate-slide-up select-none">
      <div className={`p-1 rounded-full ${getBadgeColor()}`}>
        {getIcon()}
      </div>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 p-1 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors opacity-80 hover:opacity-100"
        title="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
