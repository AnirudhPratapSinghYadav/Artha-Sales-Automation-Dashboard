import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={clsx("animate-pulse bg-gray-200 rounded", className)} />
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {[...Array(6)].map((_, i) => (
                <th key={i} className="py-3 px-6"><Skeleton className="h-4 w-20" /></th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[...Array(rows)].map((_, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6"><div className="flex gap-3 items-center"><Skeleton className="w-8 h-8 rounded-full" /><Skeleton className="h-4 w-32" /></div></td>
                <td className="py-4 px-6"><Skeleton className="h-4 w-24" /></td>
                <td className="py-4 px-6"><Skeleton className="h-4 w-32" /></td>
                <td className="py-4 px-6"><Skeleton className="h-4 w-24" /></td>
                <td className="py-4 px-6"><Skeleton className="h-4 w-16" /></td>
                <td className="py-4 px-6"><Skeleton className="h-4 w-24" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <Skeleton className="h-6 w-1/3 mb-4" />
      <Skeleton className="h-10 w-full mb-6" />
      <Skeleton className="h-4 w-2/3 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function KanbanSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-220px)] hide-scrollbar">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex flex-col min-w-[300px] w-[300px] bg-gray-50/50 rounded-xl">
          <div className="p-3 border-t-4 border-gray-200 flex justify-between items-center rounded-t-xl">
             <Skeleton className="h-5 w-24" />
             <Skeleton className="h-5 w-8 rounded-full" />
          </div>
          <div className="flex-1 p-3 space-y-3">
             {[...Array(3)].map((_, j) => (
               <div key={j} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between mb-2">
                     <Skeleton className="h-4 w-1/2" />
                     <Skeleton className="h-4 w-8 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-1/3 mb-3" />
                  <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
                     <Skeleton className="h-3 w-16" />
                     <Skeleton className="h-3 w-10" />
                  </div>
               </div>
             ))}
          </div>
        </div>
      ))}
    </div>
  );
}
