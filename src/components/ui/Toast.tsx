'use client';

import React from 'react';
import { CheckCircle2, Lock, X } from 'lucide-react';
import type { ToastProps } from './types';

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className={`p-4 rounded-xl border shadow-2xl flex items-center gap-3 font-bold text-xs ${
        type === 'success' 
          ? 'bg-emerald-500 text-white border-emerald-400' 
          : type === 'error'
          ? 'bg-rose-600 text-white border-rose-500'
          : 'bg-amber-500 text-white border-amber-400'
      }`}>
        {type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <Lock className="w-5 h-5 shrink-0" />}
        <span className="max-w-xs">{message}</span>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-white/20 transition-colors ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
