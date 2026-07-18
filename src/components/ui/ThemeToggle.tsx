'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-md bg-transparent" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-zinc-800/50 focus:outline-none transition-all duration-200 hover:scale-105"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 transition-transform duration-200" />
      ) : (
        <Sun className="w-5 h-5 text-amber-500 transition-transform duration-200" />
      )}
    </button>
  );
}
