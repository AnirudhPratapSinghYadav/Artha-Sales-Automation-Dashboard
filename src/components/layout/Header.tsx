'use client';

import React, { useState, useEffect } from 'react';
import { Menu, LogOut, ChevronDown } from 'lucide-react';
import { useAuth, getRoleLabel } from '@/lib/auth';
import { getSystemStatus } from '@/lib/data';
import { SystemStatus } from '@/lib/types';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import clsx from 'clsx';

interface HeaderProps {
  title: string;
  onToggleSidebar: () => void;
}

export function Header({ title, onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const [sysStatus, setSysStatus] = useState<SystemStatus | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    getSystemStatus().then(setSysStatus);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 relative z-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 mr-4 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100/50 dark:hover:bg-zinc-800/50 focus:outline-none transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 truncate tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* System Status */}
        {sysStatus && (
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50" title={`System Status: ${sysStatus.status}`}>
            <div className="relative flex h-2 w-2">
              {sysStatus.status === 'healthy' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
              <span className={clsx("relative inline-flex rounded-full h-2 w-2", getStatusColor(sysStatus.status))}></span>
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-zinc-400">n8n</span>
          </div>
        )}

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300 flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-gray-900 dark:text-zinc-100">{user.name}</span>
                <span className="text-xs text-gray-500 dark:text-zinc-400">{getRoleLabel(user.role)}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 dark:ring-zinc-800 z-20">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-zinc-800 md:hidden">
                    <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">{getRoleLabel(user.role)}</p>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
