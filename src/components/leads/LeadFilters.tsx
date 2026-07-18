'use client';

import React from 'react';
import { ScoreTier } from '@/lib/types';
import clsx from 'clsx';
import { Download } from 'lucide-react';

interface LeadFiltersProps {
  activeTier: ScoreTier | 'ALL';
  onTierChange: (tier: ScoreTier | 'ALL') => void;
  activePeriod: string;
  onPeriodChange: (period: string) => void;
  onExport: () => void;
}

export function LeadFilters({ activeTier, onTierChange, activePeriod, onPeriodChange, onExport }: LeadFiltersProps) {
  const tiers: (ScoreTier | 'ALL')[] = [
    'ALL', 
    'Sales Ready', 
    'Qualified', 
    'Engaged', 
    'Exploring', 
    'Dormant'
  ];

  const getTierPillStyle = (tier: ScoreTier | 'ALL', isActive: boolean) => {
    if (!isActive) return 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-transparent';
    
    switch (tier) {
      case 'ALL': return 'bg-gray-800 dark:bg-zinc-200 text-white dark:text-zinc-900';
      case 'Sales Ready': return 'bg-green-500 text-white';
      case 'Qualified': return 'bg-orange-500 text-white';
      case 'Engaged': return 'bg-amber-500 text-white';
      case 'Exploring': return 'bg-blue-500 text-white';
      case 'Dormant': return 'bg-gray-400 dark:bg-zinc-600 text-white';
      default: return 'bg-gray-800 dark:bg-zinc-200 text-white dark:text-zinc-900';
    }
  };

  return (
    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
      
      {/* Tier Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {tiers.map(tier => (
          <button
            key={tier}
            onClick={() => onTierChange(tier)}
            className={clsx(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              getTierPillStyle(tier, activeTier === tier)
            )}
          >
            {tier === 'ALL' ? 'All Leads' : tier}
          </button>
        ))}
      </div>

      {/* Secondary Filters & Actions */}
      <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
        <select
          value={activePeriod}
          onChange={(e) => onPeriodChange(e.target.value)}
          className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block px-3 py-2 outline-none"
        >
          <option value="today">Today</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="all_time">All Time</option>
        </select>

        <button 
          onClick={onExport}
          className="ml-auto xl:ml-0 flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-green-600 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
    </div>
  );
}
