import { LeadStage } from './leads.types';

export interface Conversation {
  phone: string;
  lead_id: string;
  history: string;
  stage: LeadStage;
  turn_count: number;
  summary: string;
  last_updated: string;
  last_user_message: string;
  last_bot_message: string;
  last_action: string;
  alert_sent: boolean;
  meeting_link_sent: boolean;
  brochure_sent: boolean;
  last_alert_reason: string;
  last_signal: string;
  locked_until: string;
  followup_email_sent: boolean;
  sentiment: string;
  created_at: string;
  updated_at: string;
}

// NOTE: no backing table exists yet for this type as of [today's date]. Do not wire to Supabase until a table is created and confirmed.
export interface Message {
  id: string;
  sender: 'bot' | 'lead';
  content: string;
  timestamp: string;
}
