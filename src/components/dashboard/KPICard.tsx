import React from 'react';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface KPICardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string; // Tailwind color class for bg
  change?: string;
  linkText?: string;
  linkHref?: string;
}

export function KPICard({
  title,
  value,
  icon: Icon,
  color,
  change,
  linkText = 'More info →',
  linkHref = '#',
}: KPICardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center text-white", color)}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-3xl font-bold text-gray-900 dark:text-zinc-100">{value}</h4>
            <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">{title}</p>
          </div>
        </div>
        {change && (
          <div className={clsx("text-xs font-semibold px-2 py-1 rounded-full", change.startsWith('+') ? 'text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400' : 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400')}>
            {change}
          </div>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
        <Link href={linkHref} className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
          {linkText}
        </Link>
      </div>
    </Card>
  );
}
