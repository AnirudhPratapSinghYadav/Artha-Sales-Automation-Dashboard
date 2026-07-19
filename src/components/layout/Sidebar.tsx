'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  Plus,
  MessageSquare,
  Calendar,
  FolderOpen,
  Users,
  Shield,
  Settings,
  Hexagon,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/lib/auth';
import { Logo } from '@/components/ui/Logo';

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();
  const { canAccessModule } = useAuth();

  const navGroups = [
    {
      label: 'Dashboard',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Leads',
      items: [
        { name: 'All Leads', href: '/leads', icon: ClipboardList },
        { name: 'New Lead', href: '/leads/new', icon: Plus },
      ],
    },
    {
      label: 'Engagement',
      items: [
        { name: 'WhatsApp Conversations', href: '/whatsapp', icon: MessageSquare },
      ],
    },
    {
      label: 'Knowledge Base',
      items: [
        { name: 'Upload Knowledge', href: '/knowledge', icon: FolderOpen },
      ],
    },
  ];



  return (
    <div
      className={clsx(
        'h-screen bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-r border-gray-200 dark:border-zinc-800 flex flex-col sidebar-transition flex-shrink-0 relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-zinc-800 flex-shrink-0">
        {collapsed ? (
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center text-white shadow-md flex-shrink-0 mx-auto">
            <Hexagon className="w-5 h-5 fill-white/20" />
          </div>
        ) : (
          <Logo />
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            {!collapsed && (
              <h4 className="px-3 text-xs uppercase tracking-wider text-gray-400 dark:text-zinc-500 font-semibold mb-2">
                {group.label}
              </h4>
            )}
            <div className="space-y-1">
              {group.items.map(item => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 border-l-4 border-primary-500'
                        : 'text-gray-600 dark:text-zinc-450 hover:bg-gray-100 dark:hover:bg-zinc-800/50'
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon
                      className={clsx('w-5 h-5 flex-shrink-0', isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-zinc-500')}
                    />
                    {!collapsed && <span className="ml-3 truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
