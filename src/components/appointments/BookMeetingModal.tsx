import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BookMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookMeetingModal({ isOpen, onClose }: BookMeetingModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const bookingsUrl = process.env.NEXT_PUBLIC_BOOKINGS_URL || 'https://bookings.cloud.microsoft/book/LuxCalendar@thinkartha.com/?ismsaljsauthenabled=true';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
            Book Meeting (Microsoft Bookings)
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 w-full bg-gray-50 dark:bg-zinc-950">
          <iframe 
            src={bookingsUrl} 
            className="w-full h-full border-none"
            title="Microsoft Bookings"
            allow="camera; microphone; clipboard-write; autoplay; fullscreen"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
