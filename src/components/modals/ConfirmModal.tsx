'use client';

import React from 'react';
import { AlertTriangle, Trash2, Info } from 'lucide-react';
import Modal from '../ui/Modal';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <Trash2 className="w-5 h-5 text-rose-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-sky-500" />;
    }
  };

  const getConfirmBtnClass = () => {
    switch (variant) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20';
      case 'info':
      default:
        return 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="flex flex-col space-y-4">
        
        {/* Header Icon + Title */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-cso-input border border-cso shrink-0 shadow-sm">
            {getIcon()}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-black text-neutral-900 dark:text-neutral-100 leading-snug">
              {title}
            </h3>
            <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
              {message}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-4 mt-2 border-t border-cso">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-cso-input border border-cso hover:bg-neutral-200 dark:hover:bg-[#27272a] text-neutral-700 dark:text-neutral-300 font-extrabold text-xs transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={loading}
            className={`px-4 py-2.5 rounded-lg font-extrabold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50 ${getConfirmBtnClass()}`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </Modal>
  );
}
