import { supabase } from '../supabase';
import { DashboardKPIs, TrendDataPoint, LeadDistribution, ActivityEvent } from '../types';
import { getTierColor } from './leads.service';
import { format } from 'date-fns';
import { safeParseISO } from '../utils';
export async function getDashboardKPIs(period?: string): Promise<DashboardKPIs> {
  const { data: leads, error } = await supabase.from('leads').select('*');
  if (error || !leads) {
    return { total_leads: 0, new_leads: 0, sales_ready: 0, qualified: 0, meetings_booked: 0, active_conversations: 0 };
  }

  const { data: conversations } = await supabase.from('conversations').select('phone');
  const active_conversations = (conversations || []).length;

  return {
    total_leads: leads.length,
    new_leads: leads.filter(l => l.stage === 'CONTACTED' || l.stage === 'NEW').length, // treating CONTACTED as new for KPI
    sales_ready: leads.filter(l => l.lead_score_band === 'Sales Ready').length,
    qualified: leads.filter(l => l.lead_score_band === 'Qualified').length,
    meetings_booked: leads.filter(l => l.stage === 'MEETING_BOOKED').length,
    active_conversations: active_conversations
  };
}

export async function getLeadTrend(period?: string): Promise<TrendDataPoint[]> {
  const { data: leads } = await supabase.from('leads').select('date_added');
  if (!leads) return [];

  const counts: Record<string, number> = {};
  leads.forEach(l => {
    const parsed = safeParseISO(l.date_added);
    if (!parsed) return;
    const date = format(parsed, 'yyyy-MM-dd');
    counts[date] = (counts[date] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, value]) => ({ date, value }));
}

export async function getLeadDistributionData(): Promise<LeadDistribution[]> {
  const { data: leads } = await supabase.from('leads').select('lead_score_band');
  if (!leads) return [];

  const counts: Record<string, number> = {
    'Sales Ready': 0,
    'Qualified': 0,
    'Engaged': 0,
    'Exploring': 0,
    'Dormant': 0
  };

  leads.forEach(l => {
    const tier = l.lead_score_band || 'Dormant';
    if (counts[tier] !== undefined) counts[tier]++;
  });

  return (Object.keys(counts) as any[]).map(tier => ({
    tier,
    count: counts[tier],
    color: getTierColor(tier as any) || 'bg-gray-400'
  }));
}

export async function getActivityFeed(limit: number = 20): Promise<ActivityEvent[]> {
  const { data: alerts, error } = await supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !alerts) return [];

  return alerts.map((row: any) => {
    let type: ActivityEvent['type'] = 'alert';
    if (row.trigger_reason === 'MEETING_BOOKED') type = 'meeting_booked';
    else if (row.trigger_reason === 'DNC') type = 'dnc';

    let icon = '🔔';
    if (type === 'meeting_booked') icon = '📅';
    else if (type === 'dnc') icon = '🚫';

    const payload = row.payload || {};
    const leadName = payload.lead_name || 'A lead';
    const leadCompany = payload.lead_company || 'unknown company';
    const message = `${leadName} at ${leadCompany}: ${row.trigger_reason}`;

    return {
      id: row.id,
      type,
      message,
      lead_name: payload.lead_name,
      lead_id: row.lead_id,
      timestamp: row.created_at,
      icon
    };
  });
}

export function subscribeToAlerts(callback: (payload: any) => void) {
  const channel = supabase.channel('public:alerts');
  
  channel.on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, callback).subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}
