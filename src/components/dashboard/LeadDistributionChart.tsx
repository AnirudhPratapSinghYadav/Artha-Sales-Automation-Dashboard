'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { LeadDistribution } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface LeadDistributionChartProps {
  data: LeadDistribution[];
}

export function LeadDistributionChart({ data }: LeadDistributionChartProps) {
  // Custom legend to match tier styling
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center text-sm text-gray-600 dark:text-zinc-400">
            <span 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-medium mr-1">{entry.payload.tier}:</span>
            <span>{entry.payload.count}</span>
          </li>
        ))}
      </ul>
    );
  };

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">Loading chart...</div>
      </Card>
    );
  }

  if (!data || data.length === 0 || data.every(d => d.count === 0)) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="text-gray-500 dark:text-zinc-400">No lead distribution data.</p>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-100 mb-4">Lead Distribution</h3>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="count"
              nameKey="tier"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any, name: any) => [value, name]}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend content={renderLegend} verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
