'use client';

import React, { useState } from 'react';
import { Lead } from '@/lib/types';
import { getTierColor } from '@/lib/data';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { LeadDetail } from './LeadDetail';
import clsx from 'clsx';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
}

type SortField = 'id' | 'first_name' | 'company' | 'overall_score' | 'last_contacted';
type SortDirection = 'asc' | 'desc';

export function LeadTable({ leads }: LeadTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('overall_score');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'first_name') {
      comparison = a.first_name.localeCompare(b.first_name);
    } else if (sortField === 'company') {
      comparison = a.company.localeCompare(b.company);
    } else if (sortField === 'overall_score') {
      comparison = a.lead_score_total - b.lead_score_total;
    } else if (sortField === 'last_contacted') {
      // Handle nulls
      if (!a.last_contacted && !b.last_contacted) comparison = 0;
      else if (!a.last_contacted) comparison = -1;
      else if (!b.last_contacted) comparison = 1;
      else comparison = new Date(a.last_contacted).getTime() - new Date(b.last_contacted).getTime();
    } else {
      comparison = a.id.localeCompare(b.id);
    }

    return sortDir === 'asc' ? comparison : -comparison;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp className="inline w-4 h-4 ml-1" /> : <ChevronDown className="inline w-4 h-4 ml-1" />;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors" onClick={() => handleSort('first_name')}>
                Name <SortIcon field="first_name" />
              </th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors" onClick={() => handleSort('company')}>
                Company <SortIcon field="company" />
              </th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Contact</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors" onClick={() => handleSort('overall_score')}>
                Score <SortIcon field="overall_score" />
              </th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Stage</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors" onClick={() => handleSort('last_contacted')}>
                Last Contact <SortIcon field="last_contacted" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
            {sortedLeads.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-zinc-400">
                  No leads found matching the criteria.
                </td>
              </tr>
            ) : (
              sortedLeads.map((lead) => {
                const isExpanded = expandedRow === lead.id;
                
                return (
                  <React.Fragment key={lead.id}>
                    <tr 
                      onClick={() => setExpandedRow(isExpanded ? null : lead.id)}
                      className={clsx(
                        "hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors group",
                        isExpanded && "bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                      )}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm", 
                            isExpanded ? 'bg-primary-600 text-white' : 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                          )}>
                            {lead.first_name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                              {lead.first_name} {lead.last_name}
                              {lead.handoff_required && (
                                <span title="Handoff Required">
                                  <AlertCircle className="w-4 h-4 text-red-500" />
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-zinc-400">{lead.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900 dark:text-zinc-100 font-medium">
                        {lead.company}
                        <div className="text-xs text-gray-500 dark:text-zinc-400 font-normal">{lead.industry}</div>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <div className="text-gray-900 dark:text-zinc-100 truncate max-w-[150px]" title={lead.email}>{lead.email}</div>
                        <div className="text-gray-500 dark:text-zinc-400 text-xs">+{lead.phone}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", getTierColor(lead.lead_score_band as any))}>
                          {lead.lead_score_total} - {lead.lead_score_band}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 dark:text-zinc-300 capitalize">
                        {lead.stage.toLowerCase().replace('_', ' ')}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500 dark:text-zinc-400">
                        {lead.last_contacted 
                          ? formatDistanceToNow(new Date(lead.last_contacted), { addSuffix: true }) 
                          : 'Never'}
                      </td>
                    </tr>
                    
                    {/* Expanded Detail Row */}
                    {isExpanded && (
                      <tr className="bg-gray-50 dark:bg-zinc-800/30 border-b-2 border-primary-100 dark:border-primary-900/30">
                        <td colSpan={6} className="p-0">
                          <LeadDetail lead={lead} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
