'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Conversation, Lead, Message } from '@/lib/types';
import { getMessages, subscribeToConversations } from '@/lib/data';
import { MessageBubble } from './MessageBubble';
import { Phone, MoreVertical, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/ToastProvider';
import clsx from 'clsx';
import { format,  } from 'date-fns';
import { safeParseISO, safeFormatDistance } from '@/lib/utils';

interface ChatThreadProps {
  conversation: Conversation | null;
  lead: Lead | null;
}

export function ChatThread({ conversation, lead }: ChatThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadMsgs() {
      if (!conversation) return;
      setLoading(true);
      const msgs = await getMessages(conversation.phone);
      setMessages(msgs);
      setLoading(false);
    }
    loadMsgs();

    if (conversation) {
      const channel = subscribeToConversations(conversation.phone, async () => {
        const msgs = await getMessages(conversation.phone);
        setMessages(msgs);
      });
      return () => {
        channel.unsubscribe();
      };
    }
  }, [conversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#EFEAE2] dark:bg-zinc-900">
        <div className="bg-white/80 dark:bg-zinc-800/80 px-4 py-2 rounded-full text-sm text-gray-500 dark:text-zinc-400 shadow-sm backdrop-blur-sm">
          Select a conversation to view messages
        </div>
      </div>
    );
  }

  const leadName = lead ? `${lead.first_name} ${lead.last_name}` : conversation.phone;
  const isHumanTakeover = lead ? lead.handoff_required : false;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#EFEAE2] dark:bg-zinc-900 relative">
      {/* Background Pattern (WhatsApp style) */}
      <div 
        className="absolute inset-0 opacity-40 dark:opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 1c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm0 2C6.134 3 3 6.134 3 10s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z' fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Header */}
      <div className="h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 flex items-center justify-between z-10 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
            {lead ? lead.first_name.charAt(0) : '?'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-zinc-100 leading-tight">{leadName}</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 flex items-center gap-2">
              +{conversation.phone}
              {lead && <span className="text-gray-300 dark:text-zinc-700">•</span>}
              {lead && <span>{lead.company}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={isHumanTakeover ? 'active' : 'exploring'} className="hidden sm:inline-flex shadow-sm">
            {isHumanTakeover ? 'Human Active' : 'AI Active'}
          </Badge>
          
          <button 
            onClick={() => toast({ title: 'Human takeover — coming soon', message: 'Takeover functionality is coming soon.' })}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border shadow-sm flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
            title="Takeover functionality is coming soon"
          >
            <ShieldAlert className="w-4 h-4" /> Take Over
          </button>
          
          <div className="w-px h-6 bg-gray-200 dark:bg-zinc-800 hidden sm:block"></div>
          <button className="text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300 p-2 hidden sm:block">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 z-10 space-y-2 flex flex-col"
      >
        {loading ? (
          <div className="space-y-4 flex flex-col justify-end h-full animate-pulse">
            <div className="h-10 w-1/3 bg-gray-100 dark:bg-zinc-800 rounded-lg rounded-bl-none self-start" />
            <div className="h-12 w-1/2 bg-green-50 dark:bg-zinc-900/50 rounded-lg rounded-br-none self-end" />
            <div className="h-10 w-2/5 bg-gray-100 dark:bg-zinc-800 rounded-lg rounded-bl-none self-start" />
            <div className="h-10 w-1/3 bg-green-50 dark:bg-zinc-900/50 rounded-lg rounded-br-none self-end" />
          </div>
        ) : (
          messages.map((msg, idx) => {
            const currentParsed = safeParseISO(msg.timestamp);
            const prevParsed = idx > 0 ? safeParseISO(messages[idx-1].timestamp) : null;
            const currentFormatted = currentParsed ? format(currentParsed, 'yyyy-MM-dd') : 'Unknown';
            const prevFormatted = prevParsed ? format(prevParsed, 'yyyy-MM-dd') : 'Unknown';
            
            // Show date separator if date changed
            const showDate = idx === 0 || currentFormatted !== prevFormatted;
            
            return (
              <React.Fragment key={idx}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur shadow-sm px-3 py-1 rounded-full text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wide">
                      {currentParsed ? format(currentParsed, 'MMM d, yyyy') : 'Unknown'}
                    </span>
                  </div>
                )}
                <MessageBubble message={msg} leadName={leadName} />
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* Input Placeholder (Read-only for now unless Taken Over) */}
      <div className="bg-[#f0f2f5] dark:bg-zinc-950 p-3 z-10 flex-shrink-0 shadow-[0_-1px_2px_rgba(0,0,0,0.05)] dark:shadow-[0_-1px_2px_rgba(0,0,0,0.5)]">
        <div className="bg-white dark:bg-zinc-900 rounded-xl px-4 py-3 text-sm text-gray-400 dark:text-zinc-500 flex items-center justify-between border border-gray-200 dark:border-zinc-800">
          <span>
            {isHumanTakeover 
              ? "Type a message... (Mock UI)" 
              : "Maya is managing this conversation. Click 'Take Over' to intervene."}
          </span>
          {isHumanTakeover && <button className="text-primary-600 dark:text-primary-400 font-medium">Send</button>}
        </div>
      </div>
    </div>
  );
}
