'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ActivityEvent } from '@/lib/types';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface ActivityFeedProps {
  events: ActivityEvent[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-100">Live Activity Feed</h3>
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full border border-green-100 dark:border-green-900/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider">Live</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4">
        {events.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-zinc-400 text-center py-4">No recent activity.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="flex gap-4 p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-zinc-800">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-lg">
                {event.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                  {event.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                  {formatDistanceToNow(parseISO(event.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
