'use client';

import React from 'react';
import { Message } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import clsx from 'clsx';

interface MessageBubbleProps {
  message: Message;
  leadName?: string;
}

export function MessageBubble({ message, leadName }: MessageBubbleProps) {
  const isBot = message.sender === 'bot';
  const time = format(parseISO(message.timestamp), 'h:mm a');
  
  return (
    <div className={clsx("flex w-full mb-4", isBot ? "justify-start" : "justify-end")}>
      <div className={clsx(
        "max-w-[75%] md:max-w-[60%] flex flex-col shadow-sm",
        isBot 
          ? "bg-white border border-gray-200 rounded-2xl rounded-bl-none" 
          : "bg-green-100 rounded-2xl rounded-br-none"
      )}>
        <div className="px-4 py-2 text-sm text-gray-900 whitespace-pre-wrap">
          {message.content}
        </div>
        <div className={clsx(
          "px-4 pb-1.5 text-[10px] text-right",
          isBot ? "text-gray-400" : "text-green-800/60"
        )}>
          {time}
        </div>
      </div>
    </div>
  );
}
