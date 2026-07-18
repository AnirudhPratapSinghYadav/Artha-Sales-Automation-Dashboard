'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import clsx from 'clsx';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  onClose: (id: string) => void;
}

export function Toast({ id, title, message, variant = 'info', onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900',
    error: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900',
    warning: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900',
  };

  return (
    <div className={clsx('flex items-start p-4 border rounded-xl shadow-lg w-80 pointer-events-auto animate-toast-slide-in', bgColors[variant])}>
      <div className="flex-shrink-0 mr-3">
        {icons[variant]}
      </div>
      <div className="flex-1">
        {title && <h4 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">{title}</h4>}
        <p className="text-sm text-gray-700 dark:text-zinc-300 mt-0.5">{message}</p>
      </div>
      <button 
        onClick={() => onClose(id)}
        className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
