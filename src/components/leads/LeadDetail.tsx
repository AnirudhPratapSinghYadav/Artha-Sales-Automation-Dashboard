'use client';

import React, { useEffect, useState } from 'react';
import { Lead, Conversation } from '@/lib/types';
import { getConversations, getTierColor } from '@/lib/data';
import { ScoreBreakdown } from './ScoreBreakdown';
import { Badge } from '@/components/ui/Badge';
import { formatDistanceToNow, format } from 'date-fns';
import { safeParseISO, safeFormatDistance } from '@/lib/utils';
import { Mail, Phone, MapPin, Briefcase, AlertCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface LeadDetailProps {
  lead: Lead;
}

export function LeadDetail({ lead }: LeadDetailProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConversations() {
      setLoading(true);
      const data = await getConversations(lead.id);
      setConversations(data);
      setLoading(false);
    }
    loadConversations();
  }, [lead.id]);

  return (
    <div className="p-6 bg-gray-50 border-x border-b border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: Profile & Scores */}
        <div className="space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{lead.first_name} {lead.last_name}</h2>
                <p className="text-primary-600 font-medium">{lead.title} at {lead.company}</p>
              </div>
              <Badge variant={lead.lead_score_band?.toLowerCase().replace(' ', '-') as any} className="text-sm px-3 py-1">
                {lead.lead_score_band}
              </Badge>
            </div>

            <p className="text-gray-600 text-sm mb-6">{lead.brief}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                <a href={`mailto:${lead.email}`} className="hover:text-primary-600 truncate">{lead.email}</a>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <a href={`tel:${lead.phone}`} className="hover:text-primary-600 truncate">+{lead.phone}</a>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span className="truncate">{lead.country}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                <span className="truncate">{lead.industry}</span>
              </div>
            </div>
          </div>

          <ScoreBreakdown lead={lead} />
        </div>

        {/* RIGHT COLUMN: Actions & History */}
        <div className="space-y-6">
          
          {/* Next Action Card */}
          <div className="bg-primary-50 rounded-xl border border-primary-200 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-800 mb-2">Next Recommended Action</h3>
            <p className="text-primary-900 font-medium">{lead.next_action}</p>
          </div>

          {/* Handoff Alert */}
          {lead.handoff_required && (
            <div className="bg-red-50 rounded-xl border border-red-200 p-5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-red-800 mb-1">Human Handoff Required</h3>
                <p className="text-red-900 text-sm">{lead.handoff_reason}</p>
              </div>
            </div>
          )}

          {/* Conversation History */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-96">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                Recent Conversations
              </h3>
              <Link 
                href={`/whatsapp`} 
                className="text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-2 py-1 rounded"
              >
                Open in WhatsApp View
              </Link>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="border border-gray-100 dark:border-zinc-800 rounded-lg p-4 bg-gray-50/50 dark:bg-zinc-900/50 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-20" />
                        <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-16" />
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full" />
                      <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-5/6" />
                    </div>
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <p className="text-center text-sm text-gray-500 my-8">No conversation history yet.</p>
              ) : (
                conversations.map((conv, idx) => (
                  <div key={conv.phone + idx} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="active" className="text-xs bg-gray-200 text-gray-700">Stage: {conv.stage}</Badge>
                      <span className="text-xs text-gray-500">
                        {safeFormatDistance(conv.last_updated, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 font-medium mb-3">{conv.summary}</p>
                    
                    {/* Tiny snippet of history */}
                    <div className="text-xs space-y-2 pl-3 border-l-2 border-gray-200 text-gray-600 max-h-32 overflow-y-auto">
                      {conv.history.split('\n').slice(-3).map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
