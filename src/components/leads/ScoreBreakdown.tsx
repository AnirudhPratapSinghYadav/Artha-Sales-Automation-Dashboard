'use client';

import React from 'react';
import { LeadSignals } from '@/lib/types';
import { getTierColor } from '@/lib/data';
import { Badge } from '@/components/ui/Badge';
import clsx from 'clsx';

interface ScoreBreakdownProps {
  signals: LeadSignals;
}

export function ScoreBreakdown({ signals }: ScoreBreakdownProps) {
  const categories = [
    { label: 'Intent', score: signals.intent_score, max: 25 },
    { label: 'Fit', score: signals.fit_score, max: 25 },
    { label: 'Momentum', score: signals.momentum_score, max: 25 },
    { label: 'Buying Readiness', score: signals.buying_readiness, max: 25 },
  ];

  const tierColorClass = getTierColor(signals.tier).split(' ')[0]; // Gets just the bg color

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Score Breakdown</h3>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-gray-900">{signals.overall_score}</span>
          <Badge variant={signals.tier.toLowerCase().replace(' ', '-') as any} className="text-sm px-3 py-1">
            {signals.tier}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((cat, idx) => {
          const percentage = (cat.score / cat.max) * 100;
          return (
            <div key={idx}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                <span className="text-sm font-semibold text-gray-900">{cat.score}/{cat.max}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={clsx("h-full rounded-full", tierColorClass)} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
