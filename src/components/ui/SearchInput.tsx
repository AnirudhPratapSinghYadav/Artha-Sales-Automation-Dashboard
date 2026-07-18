import React from 'react';
import { Search, X } from 'lucide-react';
import clsx from 'clsx';

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchInput({ value, onChange, placeholder = 'Search...', className, autoFocus }: SearchInputProps) {
  return (
    <div className={clsx("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500/50 outline-none transition-shadow"
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
