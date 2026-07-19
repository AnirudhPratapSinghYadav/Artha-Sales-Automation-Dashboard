'use client';

import React from 'react';
import { UnansweredQuestion } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { HelpCircle, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow,  } from 'date-fns';
import { safeParseISO, safeFormatDistance } from '@/lib/utils';
import clsx from 'clsx';

interface KnowledgeGapDetectorProps {
  questions: UnansweredQuestion[];
}

export function KnowledgeGapDetector({ questions }: KnowledgeGapDetectorProps) {
  
  // Sort by most asked
  const sortedQuestions = [...questions].sort((a, b) => b.times_asked - a.times_asked);

  return (
    <Card 
      title="Knowledge Gaps Detected" 
      subtitle="Questions where Maya had low-confidence retrieval"
    >
      {questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-900/50">
          <CheckCircle2 className="w-10 h-10 mb-2 text-green-500" />
          <p className="font-medium">No knowledge gaps detected</p>
          <p className="text-sm">Maya is successfully answering all questions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedQuestions.map(q => {
            const confidencePercent = Math.round(q.similarity_score * 100);
            const isVeryLow = confidencePercent < 50;
            
            return (
              <div key={q.id} className="p-4 border border-gray-200 dark:border-zinc-800 rounded-lg hover:border-gray-300 dark:hover:border-zinc-700 transition-colors bg-white dark:bg-zinc-900">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <HelpCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-zinc-100 leading-tight mb-1">"{q.question}"</h4>
                      <p className="text-xs text-gray-500 dark:text-zinc-400">
                        Asked by {q.lead_name} • {safeFormatDistance(q.asked_at, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-xs font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-2 py-1 rounded-full mb-2">
                      Asked {q.times_asked} time{q.times_asked !== 1 ? 's' : ''}
                    </span>
                    
                    <div className="flex items-center gap-2 w-24">
                      <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-medium w-8 text-right">{confidencePercent}%</span>
                      <div className="h-1.5 flex-1 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={clsx("h-full rounded-full", isVeryLow ? "bg-red-500" : "bg-amber-500")}
                          style={{ width: `${confidencePercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
