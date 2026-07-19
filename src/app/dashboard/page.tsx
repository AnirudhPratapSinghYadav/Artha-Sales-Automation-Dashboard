'use client';

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, CheckCircle2, ShieldCheck, Calendar, MessageSquare } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { LeadsOverviewChart } from '@/components/dashboard/LeadsOverviewChart';
import { LeadDistributionChart } from '@/components/dashboard/LeadDistributionChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { CardSkeleton } from '@/components/ui/Skeletons';
import { 
  getDashboardKPIs, 
  getLeadTrend, 
  getLeadDistributionData, 
  getActivityFeed,
  subscribeToAlerts
} from '@/lib/data';
import { DashboardKPIs, TrendDataPoint, LeadDistribution, ActivityEvent } from '@/lib/types';
import { useToast } from '@/components/ui/ToastProvider';

export default function DashboardPage() {
  const { toast } = useToast();
  const [period, setPeriod] = useState('this_week');
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [distributionData, setDistributionData] = useState<LeadDistribution[]>([]);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [kpiData, trend, dist, activity] = await Promise.all([
          getDashboardKPIs(period),
          getLeadTrend(period),
          getLeadDistributionData(),
          getActivityFeed(15)
        ]);
        
        setKpis(kpiData);
        setTrendData(trend);
        setDistributionData(dist);
        setEvents(activity);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        toast({ title: 'Error', message: 'Failed to load dashboard data', variant: 'error' });
      } finally {
        setLoading(false);
      }
    }

    loadData();

    const intervalId = setInterval(async () => {
      try {
        const newEvents = await getActivityFeed(15);
        setEvents(newEvents);
      } catch (error) {
        // Silent fail for polling
      }
    }, 30000);

    const channel = subscribeToAlerts(async () => {
      const newEvents = await getActivityFeed(15);
      setEvents(newEvents);
    });

    return () => {
      clearInterval(intervalId);
      channel.unsubscribe();
    };
  }, [period]);

  if (loading || !kpis) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
          <div className="h-10 w-28 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CardSkeleton />
          </div>
          <div>
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-zinc-100">Dashboard</h2>
        <div className="flex items-center gap-2">
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 cursor-pointer"
            aria-label="Select time period"
          >
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="all_time">All Time</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard 
          title="Total Leads" 
          value={kpis.total_leads} 
          icon={Users} 
          color="bg-primary-100 text-primary-600" 
          linkHref="/leads"
        />
        <KPICard 
          title="New Leads" 
          value={kpis.new_leads} 
          icon={UserPlus} 
          color="bg-green-100 text-green-600" 
          linkHref="/leads?stage=NEW"
        />
        <KPICard 
          title="Sales Ready" 
          value={kpis.sales_ready} 
          icon={CheckCircle2} 
          color="bg-green-100 text-green-600" 
          linkHref="/leads?tier=Sales+Ready"
        />
        <KPICard 
          title="Qualified" 
          value={kpis.qualified} 
          icon={ShieldCheck} 
          color="bg-orange-100 text-orange-600" 
          linkHref="/leads?tier=Qualified"
        />
        <KPICard 
          title="Meetings Booked" 
          value={kpis.meetings_booked} 
          icon={Calendar} 
          color="bg-blue-100 text-blue-600" 
          linkHref="/leads?stage=MEETING_BOOKED"
        />
        <KPICard 
          title="Active Conversations" 
          value={kpis.active_conversations} 
          icon={MessageSquare} 
          color="bg-amber-100 text-amber-600" 
          linkHref="/whatsapp"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LeadsOverviewChart 
            data={trendData} 
            period={period} 
            currentCount={kpis.total_leads} 
            percentageChange={18.9} 
          />
        </div>
        <div className="lg:col-span-1">
          <LeadDistributionChart data={distributionData} />
        </div>
      </div>

      {/* Activity Feed Row */}
      <div className="h-96">
        <ActivityFeed events={events} />
      </div>
    </div>
  );
}
