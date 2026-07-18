'use client';

import React, { ReactNode } from 'react';
import { Card } from './Card';
import clsx from 'clsx';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({ icon, title, description, action, className, compact = false }: EmptyStateProps) {
  return (
    <Card className={clsx("flex flex-col items-center justify-center text-center", compact ? "p-6" : "p-12", className)}>
      <div className={clsx("rounded-full bg-gray-50 dark:bg-zinc-900/50 flex items-center justify-center mb-4 text-gray-400 dark:text-zinc-500", compact ? "w-12 h-12" : "w-16 h-16")}>
        {icon}
      </div>
      <h3 className={clsx("font-medium text-gray-900 dark:text-zinc-100", compact ? "text-base" : "text-lg")}>
        {title}
      </h3>
      <p className={clsx("text-gray-500 dark:text-zinc-400 mt-1 max-w-sm", compact ? "text-xs mb-3" : "text-sm mb-6")}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </Card>
  );
}
