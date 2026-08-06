'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Trash2, Lock, Info, X } from 'lucide-react';
import type { ToastType, ToastContextValue } from '@/types';

export interface ToastItem {
  id: string;
  message: string;
  type?: ToastType;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Global Toast Stack Container - Stacked in a flex column, never overlapping */}
      <div 
        className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-2.5 items-end pointer-events-none max-w-sm w-full px-4 sm:px-0"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

/* Individual Toast Card Item Component */
function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const { message, type = 'success' } = toast;
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Auto dismiss after 3.5 seconds - Starts timer ONCE on mount per toast item
  useEffect(() => {
    const timer = setTimeout(() => {
      onCloseRef.current();
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case 'delete':
        return <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />;
      case 'closed':
        return <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />;
    }
  };

  const getAccentStyle = () => {
    switch (type) {
      case 'success':
        return {
          border: 'border-emerald-500/40 shadow-emerald-500/10',
          badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
          progressBg: 'bg-emerald-500'
        };
      case 'delete':
        return {
          border: 'border-rose-500/50 shadow-rose-500/15',
          badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400',
          progressBg: 'bg-rose-500'
        };
      case 'closed':
        return {
          border: 'border-amber-500/40 shadow-amber-500/10',
          badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
          progressBg: 'bg-amber-500'
        };
      case 'error':
        return {
          border: 'border-rose-500/40 shadow-rose-500/10',
          badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400',
          progressBg: 'bg-rose-500'
        };
      case 'warning':
        return {
          border: 'border-amber-500/40 shadow-amber-500/10',
          badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
          progressBg: 'bg-amber-500'
        };
      case 'info':
      default:
        return {
          border: 'border-sky-500/40 shadow-sky-500/10',
          badgeBg: 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400',
          progressBg: 'bg-sky-500'
        };
    }
  };

  const style = getAccentStyle();

  return (
    <div className="w-full animate-slide-up pointer-events-auto">
      <div className={`relative overflow-hidden rounded-xl bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border ${style.border} text-neutral-900 dark:text-neutral-100 shadow-xl dark:shadow-2xl p-3.5 pr-4 flex items-center gap-3 font-semibold text-xs transition-all`}>
        
        {/* Status Icon */}
        <div className={`p-1.5 rounded-lg border ${style.badgeBg} flex items-center justify-center shrink-0`}>
          {getIcon()}
        </div>

        {/* Toast Body Text */}
        <span className="flex-1 leading-snug font-medium text-neutral-800 dark:text-neutral-200">
          {message}
        </span>

        {/* Manual Dismiss Button */}
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Auto-Dismiss Progress Bar */}
        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-200 dark:bg-neutral-800">
          <div
            className={`h-full w-0 ${style.progressBg}`}
            style={{ animation: 'progressShrink 3500ms linear forwards' }}
          />
        </div>

      </div>
    </div>
  );
}
