'use client';

import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { Lead } from '@/lib/types';
import { getLeads } from '@/lib/data';
import { Search, LayoutDashboard, Users, Calendar, MessageSquare, FolderOpen, User as UserIcon, Shield } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  
  const [leads, setLeads] = useState<Lead[]>([]);


  useEffect(() => {
    // Toggle on Cmd+K or Ctrl+K
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (open) {
      getLeads().then(setLeads);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/50 dark:bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh]" onClick={() => setOpen(false)}>
      <div 
        className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-zinc-800"
        onClick={e => e.stopPropagation()}
      >
        <Command>
          <div className="flex items-center border-b border-gray-200 dark:border-zinc-800 px-3 bg-white dark:bg-zinc-900">
            <Search className="w-5 h-5 text-gray-400 dark:text-zinc-500 shrink-0" />
            <Command.Input 
              autoFocus 
              placeholder="Search leads, appointments, or jump to page... (Cmd+K)" 
              className="flex-1 px-3 py-4 text-base outline-none bg-transparent placeholder:text-gray-400 dark:placeholder:text-zinc-550 text-gray-900 dark:text-zinc-100"
            />
            <div className="text-xs text-gray-400 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded font-mono">ESC</div>
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2 hide-scrollbar bg-white dark:bg-zinc-900">
            <Command.Empty className="p-4 text-center text-sm text-gray-500 dark:text-zinc-400">No results found.</Command.Empty>

            <Command.Group heading="Pages" className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-2 px-2 pt-2">
              <Command.Item 
                onSelect={() => { router.push('/dashboard'); setOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-900 dark:text-zinc-350 rounded-lg aria-selected:bg-primary-50 dark:aria-selected:bg-primary-950/30 aria-selected:text-primary-700 dark:aria-selected:text-primary-300 cursor-pointer transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Command.Item>
              <Command.Item 
                onSelect={() => { router.push('/leads'); setOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-900 dark:text-zinc-355 rounded-lg aria-selected:bg-primary-50 dark:aria-selected:bg-primary-950/30 aria-selected:text-primary-700 dark:aria-selected:text-primary-300 cursor-pointer transition-colors"
              >
                <Users className="w-4 h-4" /> All Leads
              </Command.Item>

              <Command.Item 
                onSelect={() => { router.push('/whatsapp'); setOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-900 dark:text-zinc-355 rounded-lg aria-selected:bg-primary-50 dark:aria-selected:bg-primary-950/30 aria-selected:text-primary-700 dark:aria-selected:text-primary-300 cursor-pointer transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp Conversations
              </Command.Item>
              <Command.Item 
                onSelect={() => { router.push('/knowledge'); setOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-900 dark:text-zinc-355 rounded-lg aria-selected:bg-primary-50 dark:aria-selected:bg-primary-950/30 aria-selected:text-primary-700 dark:aria-selected:text-primary-300 cursor-pointer transition-colors"
              >
                <FolderOpen className="w-4 h-4" /> Knowledge Base
              </Command.Item>
              <Command.Item 
                onSelect={() => { router.push('/admin/users'); setOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-900 dark:text-zinc-355 rounded-lg aria-selected:bg-primary-50 dark:aria-selected:bg-primary-950/30 aria-selected:text-primary-700 dark:aria-selected:text-primary-300 cursor-pointer transition-colors"
              >
                <UserIcon className="w-4 h-4" /> User Directory
              </Command.Item>
              <Command.Item 
                onSelect={() => { router.push('/admin/roles'); setOpen(false); }}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-900 dark:text-zinc-355 rounded-lg aria-selected:bg-primary-50 dark:aria-selected:bg-primary-950/30 aria-selected:text-primary-700 dark:aria-selected:text-primary-300 cursor-pointer transition-colors"
              >
                <Shield className="w-4 h-4" /> Roles & Permissions
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Leads" className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-2 px-2 pt-2 border-t border-gray-100 dark:border-zinc-800 mt-2">
              {leads.slice(0, 5).map(lead => (
                <Command.Item 
                  key={lead.id}
                  onSelect={() => { router.push('/leads'); setOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-900 dark:text-zinc-350 rounded-lg aria-selected:bg-primary-50 dark:aria-selected:bg-primary-950/30 aria-selected:text-primary-700 dark:aria-selected:text-primary-300 cursor-pointer transition-colors"
                >
                  <Users className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
                  <div className="flex flex-col">
                    <span>{lead.first_name} {lead.last_name}</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">{lead.company}</span>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>


          </Command.List>
        </Command>
      </div>
    </div>
  );
}
