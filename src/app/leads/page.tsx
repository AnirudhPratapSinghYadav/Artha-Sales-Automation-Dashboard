'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { SearchInput } from '@/components/ui/SearchInput';
import { LeadTable } from '@/components/leads/LeadTable';
import { KanbanBoard } from '@/components/leads/KanbanBoard';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { TableSkeleton, KanbanSkeleton } from '@/components/ui/Skeletons';
import { getLeads } from '@/lib/data';
import { Lead, ScoreTier } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { LayoutList, LayoutGrid } from 'lucide-react';
import clsx from 'clsx';
import { useToast } from '@/components/ui/ToastProvider';

export default function LeadsPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const initialTier = (searchParams.get('tier') as ScoreTier | null) || 'ALL';
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  
  // Filters state
  const [activeTier, setActiveTier] = useState<ScoreTier | 'ALL'>(initialTier);
  const [activePeriod, setActivePeriod] = useState<string>('all_time');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // We do filtering on the client for snappiness, but ideally backend
        const data = await getLeads();
        setLeads(data);
      } catch (err) {
        toast({ title: 'Error', message: 'Failed to load leads', variant: 'error' });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [toast]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Tier filter
      if (activeTier !== 'ALL' && lead.lead_score_band !== activeTier) {
        return false;
      }
      
      // Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          lead.first_name.toLowerCase().includes(q) ||
          lead.last_name.toLowerCase().includes(q) ||
          lead.company.toLowerCase().includes(q) ||
          lead.email.toLowerCase().includes(q) ||
          lead.phone.includes(q)
        );
      }
      
      return true;
    });
  }, [leads, activeTier, searchQuery]);

  const handleExportCSV = () => {
    const sanitize = (val: any) => {
      if (!val) return '""';
      const str = String(val).replace(/"/g, '""');
      return /^[=+\-@]/.test(str) ? `"'${str}"` : `"${str}"`;
    };

    const csvHeader = 'Name,Company,Email,Phone,Score,Tier,Stage\n';
    const csvContent = filteredLeads.map(l => 
      `${sanitize(l.first_name + ' ' + l.last_name)},${sanitize(l.company)},${sanitize(l.email)},${sanitize(l.phone)},${l.lead_score_total},${sanitize(l.lead_score_band)},${sanitize(l.stage)}`
    ).join('\n');
    
    const blob = new Blob([csvHeader + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `artha_leads_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const handleLeadMove = (leadId: string, newTier: ScoreTier) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, lead_score_band: newTier } : l));
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-zinc-100">Leads</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            {filteredLeads.length} leads (filtered from {leads.length} total)
          </p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-zinc-800/50 p-1 rounded-lg border border-gray-200 dark:border-zinc-800">
          <button
            onClick={() => setViewMode('list')}
            className={clsx(
              "p-2 rounded-md transition-colors flex items-center gap-2 text-sm font-medium",
              viewMode === 'list' ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 shadow-sm" : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300"
            )}
          >
            <LayoutList className="w-4 h-4" />
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={clsx(
              "p-2 rounded-md transition-colors flex items-center gap-2 text-sm font-medium",
              viewMode === 'kanban' ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 shadow-sm" : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Kanban</span>
          </button>
        </div>
      </div>

      <LeadFilters 
        activeTier={activeTier} 
        onTierChange={setActiveTier} 
        activePeriod={activePeriod} 
        onPeriodChange={setActivePeriod} 
        onExport={handleExportCSV} 
      />

      <div className="mb-6 max-w-md">
        <SearchInput 
          placeholder="Search leads by name, email, company, phone..." 
          value={searchQuery}
          onChange={(val) => setSearchQuery(val)}
        />
      </div>

      {loading ? (
        viewMode === 'list' ? <TableSkeleton /> : <KanbanSkeleton />
      ) : viewMode === 'list' ? (
        <LeadTable leads={filteredLeads} />
      ) : (
        <KanbanBoard 
          leads={filteredLeads} 
          onLeadMove={handleLeadMove} 
          onLeadClick={() => {}} 
        />
      )}
    </div>
  );
}
