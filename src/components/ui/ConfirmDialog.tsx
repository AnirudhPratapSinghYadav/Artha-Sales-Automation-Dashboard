'use client';

import React from 'react';
import { Modal } from './Modal';
import clsx from 'clsx';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  
  const getConfirmStyle = () => {
    switch (variant) {
      case 'danger': return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
      case 'warning': return 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500';
      case 'info': return 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500';
      default: return 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="" size="sm">
      <div className="p-2 sm:p-4 text-center sm:text-left flex flex-col sm:flex-row gap-4">
        {variant === 'danger' && (
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" aria-hidden="true" />
          </div>
        )}
        {variant === 'warning' && (
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 sm:mx-0 sm:h-10 sm:w-10">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500" aria-hidden="true" />
          </div>
        )}
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
          <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-zinc-100" id="modal-title">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              {message}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse bg-gray-50 dark:bg-zinc-900/50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl border-t border-gray-100 dark:border-zinc-800">
        <button
          type="button"
          className={clsx(
            "inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto transition-colors",
            getConfirmStyle()
          )}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-zinc-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700 sm:mt-0 sm:w-auto transition-colors"
          onClick={onCancel}
        >
          {cancelLabel}
        </button>
      </div>
    </Modal>
  );
}
