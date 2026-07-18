import { ScoreTier } from './leads.types';

export interface DashboardKPIs {
  total_leads: number;
  new_leads: number;
  sales_ready: number;
  qualified: number;
  meetings_booked: number;
  active_conversations: number;
}

export interface TrendDataPoint {
  date: string;
  value: number;
}

export interface LeadDistribution {
  tier: ScoreTier;
  count: number;
  color: string;
}

export interface ActivityEvent {
  id: string;
  type: 'new_lead' | 'reply' | 'meeting_booked' | 'dnc' | 'stage_change' | 'alert' | 'knowledge_upload';
  message: string;
  lead_name?: string;
  lead_id?: string;
  timestamp: string;
  icon: string;
}
