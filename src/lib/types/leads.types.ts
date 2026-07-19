export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  company: string;
  title: string;
  industry: string;
  country: string;
  phone: string;
  email: string;
  score: string;
  stage: LeadStage;
  opening_line: string;
  pain_point: string;
  date_added: string;
  message_sent: string;
  brief: string;
  last_contacted: string;
  last_reply_at: string;
  signals: string;
  next_action: string;
  handoff_required: boolean;
  handoff_reason: string;
  followup_count: number;
  intent_score: number;
  fit_score: number;
  momentum_score: number;
  buying_readiness_score: number;
  lead_score_total: number;
  lead_score_band: string;
  created_at: string;
  updated_at: string;
}

export type LeadStage =
  | 'CONTACTED'
  | 'CURIOUS'
  | 'ENGAGED'
  | 'QUALIFIED'
  | 'MEETING_BOOKED'
  | 'CLOSED'
  | 'DNC';


export type ScoreTier = 'Dormant' | 'Exploring' | 'Engaged' | 'Qualified' | 'Sales Ready';

export interface LeadFilters {
  stage?: LeadStage | 'ALL';
  tier?: ScoreTier | 'ALL';
  period?: 'today' | 'this_week' | 'this_month' | 'all_time';
  search?: string;
  country?: string;
  owner?: string;
}
