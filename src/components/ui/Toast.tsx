'use client';

import React, { useEffect, useRef } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Trash2, Lock, Info, X } from 'lucide-react';
import type { ToastProps } from '@/types';

export default function Toast({ message, type = 'success', onClose, stackIndex = 0, autoDismiss = true }: ToastProps) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Auto-dismiss toast after 3.5 seconds
  useEffect(() => {
    if (!message || !autoDismiss) return;

    const timer = setTimeout(() => {
      onCloseRef.current();
    }, 3500);

    return () => clearTimeout(timer);
  }, [message, autoDismiss]);

  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'delete':
        return <Trash2 className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'closed':
        return <Lock className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-sky-400 shrink-0" />;
    }
  };

  const getAccentStyle = () => {
    switch (type) {
      case 'success':
        return {
          border: 'border-emerald-500/40 shadow-emerald-500/10',
          badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          progressBg: 'bg-emerald-500'
        };
      case 'delete':
        return {
          border: 'border-rose-500/50 shadow-rose-500/15',
          badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          progressBg: 'bg-rose-500'
        };
      case 'closed':
        return {
          border: 'border-amber-500/40 shadow-amber-500/10',
          badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          progressBg: 'bg-amber-500'
        };
      case 'error':
        return {
          border: 'border-rose-500/40 shadow-rose-500/10',
          badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          progressBg: 'bg-rose-500'
        };
      case 'warning':
        return {
          border: 'border-amber-500/40 shadow-amber-500/10',
          badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          progressBg: 'bg-amber-500'
        };
      case 'info':
      default:
        return {
          border: 'border-sky-500/40 shadow-sky-500/10',
          badgeBg: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
          progressBg: 'bg-sky-500'
        };
    }
  };

  const style = getAccentStyle();

  return (
    <div
      className="fixed right-6 z-50 animate-slide-up pointer-events-auto max-w-sm"
      style={{ bottom: `${24 + stackIndex * 76}px` }}
    >
      <div className={`relative overflow-hidden rounded-xl bg-[#18181b]/95 dark:bg-[#09090b]/95 backdrop-blur-md border ${style.border} text-neutral-100 shadow-2xl p-3.5 pr-4 flex items-center gap-3 font-semibold text-xs transition-all`}>
        
        {/* Status Icon */}
        <div className={`p-1.5 rounded-lg border ${style.badgeBg} flex items-center justify-center shrink-0`}>
          {getIcon()}
        </div>

        {/* Toast Body Text */}
        <span className="flex-1 leading-snug font-medium text-neutral-200">
          {message}
        </span>

        {/* Manual Dismiss Button */}
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Subtle Auto-Dismiss Countdown Bar */}
        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-neutral-800">
          <div
            className={`h-full ${autoDismiss ? 'w-0' : 'w-full'} ${style.progressBg}`}
            style={{ animation: autoDismiss ? 'progressShrink 3500ms linear forwards' : 'none' }}
          />
        </div>

      </div>
    </div>
  );
}
