import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}

export function Card({ children, className, bodyClassName, title, subtitle, action, ...props }: CardProps) {
  return (
    <div className={clsx('bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden', className)} {...props}>
      {(title || subtitle || action) && (
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-start">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={clsx('p-6', bodyClassName)}>
        {children}
      </div>
    </div>
  );
}
