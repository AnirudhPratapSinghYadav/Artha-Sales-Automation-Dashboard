import React from 'react';
import clsx from 'clsx';

export type BadgeVariant =
  | 'dormant'
  | 'exploring'
  | 'engaged'
  | 'qualified'
  | 'sales-ready'
  | 'active'
  | 'invited'
  | 'disabled';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className }: BadgeProps) {
  const variantStyles = {
    dormant: 'bg-zinc-100 text-zinc-600 border border-zinc-200',
    exploring: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    engaged: 'bg-amber-50/50 text-amber-800 border border-amber-200',
    qualified: 'bg-orange-50 text-orange-700 border border-orange-200',
    'sales-ready': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    invited: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    disabled: 'bg-gray-100 text-gray-600 border border-gray-200',
  };

  return (
    <span
      className={clsx(
        'rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
