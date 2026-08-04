import type React from 'react';

export type ToastType = 'success' | 'info' | 'error';

export interface ToastProps {
  message: string | null;
  type?: ToastType;
  onClose: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  infoTooltip?: string;
}

export interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  infoTooltip?: string;
}

export interface FloatingSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string }>;
  icon?: React.ReactNode;
  infoTooltip?: string;
  placeholderOption?: string;
}
