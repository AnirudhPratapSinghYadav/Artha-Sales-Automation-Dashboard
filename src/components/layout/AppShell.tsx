'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '@/lib/auth';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { isSupabaseConfigured } from '@/lib/supabase';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Handle responsive sidebar collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLoginPage = pathname === '/login';

  // Extract a readable title from pathname
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/leads') return 'Leads';
    if (pathname === '/leads/new') return 'New Lead';
    if (pathname === '/whatsapp') return 'WhatsApp Conversations';

    if (pathname === '/knowledge') return 'Knowledge Base';
    return '';
  };

  if (!mounted || isLoading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center text-gray-900 dark:text-zinc-100">Loading...</div>;
  }

  if (isLoginPage || !isAuthenticated) {
    return <>{children}</>;
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/30 rounded-xl p-8 max-w-lg w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Supabase Not Configured</h1>
          <p className="text-gray-600 dark:text-zinc-400 mb-6">
            The application is missing required database environment variables. Please add <code className="bg-gray-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-sm text-red-500">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-gray-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-sm text-red-500">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your deployment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 overflow-hidden">
      <Sidebar collapsed={collapsed} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          title={getPageTitle()} 
          onToggleSidebar={() => setCollapsed(!collapsed)} 
        />
        
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-zinc-950 p-4 lg:p-6">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
