import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="fixed inset-0 bg-gray-900/50 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className={clsx(
        "relative w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl flex flex-col max-h-[90vh] transition-all",
        sizeClasses[size]
      )}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return null;
}
