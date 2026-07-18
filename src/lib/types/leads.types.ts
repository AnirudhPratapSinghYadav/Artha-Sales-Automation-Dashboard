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
  score: 'Hot' | 'Warm' | 'Cold';
  stage: LeadStage;
  opening_line: string;
  pain_point: string;
  date_added: string;
  message_sent: string;
  brief: string;
  last_contacted: string;
  last_reply_at: string;
  signals: LeadSignals;
  next_action: string;
  handoff_required: boolean;
  handoff_reason: string;
  created_at: string;
  updated_at: string;
}

export type LeadStage =
  | 'NEW'
  | 'CONTACTED'
  | 'CURIOUS'
  | 'ENGAGED'
  | 'QUALIFIED'
  | 'MEETING_BOOKED'
  | 'CLOSED'
  | 'DNC'
  | 'COLD_LOGGED';

export interface LeadSignals {
  intent_score: number;
  fit_score: number;
  momentum_score: number;
  buying_readiness: number;
  overall_score: number;
  tier: ScoreTier;
  detected_signals: DetectedSignal[];
}

export interface DetectedSignal {
  signal: string;
  points: number;
  category: 'intent' | 'fit' | 'momentum' | 'buying_readiness';
}

export type ScoreTier = 'Dormant' | 'Exploring' | 'Engaged' | 'Qualified' | 'Sales Ready';

export interface LeadFilters {
  stage?: LeadStage | 'ALL';
  tier?: ScoreTier | 'ALL';
  period?: 'today' | 'this_week' | 'this_month' | 'all_time';
  search?: string;
  country?: string;
  owner?: string;
}
