'use client';

import React, { useState } from 'react';
import { DetectedSignal } from '@/lib/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface WhyThisScoreProps {
  signals: DetectedSignal[];
}

export function WhyThisScore({ signals }: WhyThisScoreProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-4">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🧠</span>
          <h4 className="font-semibold text-gray-900">Why this score?</h4>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>

      {expanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="relative border-l border-gray-200 ml-3 pl-5 space-y-4 py-2">
            {signals.map((signal, idx) => {
              const isPositive = signal.points > 0;
              return (
                <div key={idx} className="relative">
                  {/* Timeline dot/emoji */}
                  <div className="absolute -left-8 top-0 bg-white rounded-full">
                    <span className="text-sm">{isPositive ? '✅' : '⚠️'}</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-700 leading-tight pr-4">
                      {signal.signal}
                    </p>
                    <span 
                      className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-md ${
                        isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {isPositive ? '+' : ''}{signal.points}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 capitalize">
                    Affects {signal.category.replace('_', ' ')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
