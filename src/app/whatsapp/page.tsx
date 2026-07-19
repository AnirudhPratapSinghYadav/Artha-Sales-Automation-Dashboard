'use client';

import React, { useState, useEffect } from 'react';
import { Conversation, Lead } from '@/lib/types';
import { getConversations, getLeads, subscribeToConversations } from '@/lib/data';
import { ChatList } from '@/components/whatsapp/ChatList';
import { ChatThread } from '@/components/whatsapp/ChatThread';
import { useToast } from '@/components/ui/ToastProvider';

export default function WhatsAppPage() {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [convsData, leadsData] = await Promise.all([
          getConversations(),
          getLeads()
        ]);
        setConversations(convsData);
        setLeads(leadsData);
      } catch (err) {
        toast({ title: 'Error', message: 'Failed to load WhatsApp data', variant: 'error' });
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Subscribe to realtime updates
    const subscription = subscribeToConversations(null, (payload) => {
      // payload.new contains the updated/new conversation row
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        setConversations(prev => {
          const exists = prev.find(c => c.phone === payload.new.phone);
          if (exists) {
            return prev.map(c => c.phone === payload.new.phone ? payload.new as Conversation : c);
          }
          return [...prev, payload.new as Conversation];
        });
      } else if (payload.eventType === 'DELETE') {
        setConversations(prev => prev.filter(c => c.phone !== payload.old.phone));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const selectedConv = conversations.find(c => c.phone === selectedId) || null;
  const selectedLead = selectedConv ? leads.find(l => l.id === selectedConv.lead_id) || null : null;

  if (loading) {
    return (
      <div className="h-[calc(100vh-theme(spacing.16)-theme(spacing.10))] -mx-4 lg:-mx-6 -my-4 lg:-my-6 flex bg-white dark:bg-zinc-950 overflow-hidden shadow-sm border border-gray-200 dark:border-zinc-800">
        {/* Left List Skeleton */}
        <div className="w-80 border-r border-gray-200 dark:border-zinc-800 flex flex-col p-4 gap-4 bg-gray-50/50 dark:bg-zinc-900/50">
          <div className="h-10 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-lg" />
          <div className="space-y-4 flex-1 overflow-y-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded w-2/3" />
                  <div className="h-3 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Thread Skeleton */}
        <div className="flex-1 hidden md:flex flex-col p-6 gap-6 justify-between bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-full" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded w-24" />
                <div className="h-3 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded w-16" />
              </div>
            </div>
            <div className="h-8 w-24 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-lg" />
          </div>
          <div className="flex-1 space-y-4 flex flex-col justify-end">
            <div className="h-10 w-1/3 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded-lg rounded-bl-none self-start" />
            <div className="h-12 w-1/2 bg-green-50 dark:bg-zinc-900/50 animate-pulse rounded-lg rounded-br-none self-end" />
            <div className="h-10 w-2/5 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded-lg rounded-bl-none self-start" />
            <div className="h-10 w-1/3 bg-green-50 dark:bg-zinc-900/50 animate-pulse rounded-lg rounded-br-none self-end" />
          </div>
          <div className="h-12 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded-lg mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-theme(spacing.16)-theme(spacing.10))] -mx-4 lg:-mx-6 -my-4 lg:-my-6 flex bg-white dark:bg-zinc-950 overflow-hidden shadow-sm border border-gray-200 dark:border-zinc-800">
      <ChatList 
        conversations={conversations} 
        selectedId={selectedId} 
        onSelect={setSelectedId} 
        leads={leads}
      />
      
      <div className="flex-1 hidden md:flex">
        <ChatThread 
          conversation={selectedConv} 
          lead={selectedLead} 
        />
      </div>

      {/* Mobile view override */}
      {selectedId && (
        <div className="md:hidden absolute inset-0 z-20 flex bg-white dark:bg-zinc-950">
          <button 
            onClick={() => setSelectedId(null)}
            className="absolute top-4 left-4 z-30 bg-white dark:bg-zinc-800 dark:text-zinc-100 shadow-md p-2 rounded-full"
          >
            ← Back
          </button>
          <ChatThread conversation={selectedConv} lead={selectedLead} />
        </div>
      )}
    </div>
  );
}
