'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '@/lib/auth';
import { ErrorBoundary } from '../ui/ErrorBoundary';

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
