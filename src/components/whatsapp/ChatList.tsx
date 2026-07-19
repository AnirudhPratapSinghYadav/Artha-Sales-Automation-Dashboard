'use client';

import React from 'react';
import { Conversation, Lead } from '@/lib/types';
import { Search } from 'lucide-react';
import { formatDistanceToNow,  } from 'date-fns';
import { safeParseISO, safeFormatDistance } from '@/lib/utils';
import clsx from 'clsx';

interface ChatListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (phone: string) => void;
  leads: Lead[];
}

export function ChatList({ conversations, selectedId, onSelect, leads }: ChatListProps) {
  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 w-80 lg:w-96 flex-shrink-0">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            placeholder="Search or start new chat"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-8">No conversations found.</p>
        ) : (
          conversations.map(conv => {
            const lead = leads.find(l => l.id === conv.lead_id);
            const leadName = lead ? `${lead.first_name} ${lead.last_name}` : conv.phone;
            const initial = lead ? lead.first_name.charAt(0) : '?';
            const isSelected = selectedId === conv.phone;
            
            return (
              <div 
                key={conv.phone}
                onClick={() => onSelect(conv.phone)}
                className={clsx(
                  "flex items-center gap-3 p-3 cursor-pointer border-b border-gray-50 transition-colors hover:bg-gray-50",
                  isSelected && "bg-primary-50 hover:bg-primary-50"
                )}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg">
                  {initial}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-medium text-gray-900 truncate text-sm">{leadName}</h4>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {safeFormatDistance(conv.last_updated, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate w-full pr-4">
                    {conv.last_user_message || conv.last_bot_message || conv.summary}
                  </p>
                </div>
                
                {/* Unread dot or alert - mock for now */}
                {conv.alert_sent && !isSelected && (
                  <div className="flex-shrink-0 w-3 h-3 bg-red-500 rounded-full mt-1 self-start"></div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
