'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { TrendDataPoint } from '@/lib/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

interface LeadsOverviewChartProps {
  data: TrendDataPoint[];
  period: string;
  currentCount: number;
  percentageChange: number;
}

export function LeadsOverviewChart({ data, period, currentCount, percentageChange }: LeadsOverviewChartProps) {
  const formattedData = data.map(d => ({
    ...d,
    formattedDate: format(parseISO(d.date), 'MMM d'),
  }));

  const isPositive = percentageChange >= 0;

  return (
    <Card className="h-full">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-100">Leads Overview</h3>
        <div className="flex items-baseline gap-3 mt-1">
          <span className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{currentCount}</span>
          <span className="text-sm text-gray-500 dark:text-zinc-400">leads {period.replace('_', ' ')}</span>
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(percentageChange).toFixed(1)}% since last {period.split('_')[1] || 'period'}
          </span>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="formattedDate" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#7C3AED" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#7C3AED' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
