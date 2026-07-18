// =============================================================================
// Artha Sales Automation — TypeScript Types
// Matches exact Supabase production schema
// =============================================================================

// ---------------------------------------------------------------------------
// Leads Table
// ---------------------------------------------------------------------------
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
  date_added: string; // ISO timestamp
  message_sent: string; // ISO timestamp
  brief: string;
  last_contacted: string; // ISO timestamp
  last_reply_at: string; // ISO timestamp
  signals: LeadSignals;
  next_action: string;
  handoff_required: boolean;
  handoff_reason: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
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

// ---------------------------------------------------------------------------
// Lead Signals — JSON object stored in the signals column
// ---------------------------------------------------------------------------
export interface LeadSignals {
  intent_score: number;       // 0-25
  fit_score: number;          // 0-25
  momentum_score: number;     // 0-25
  buying_readiness: number;   // 0-25
  overall_score: number;      // 0-100
  tier: ScoreTier;
  detected_signals: DetectedSignal[];
}

export interface DetectedSignal {
  signal: string;           // e.g. "Mentioned budget"
  points: number;           // positive = boost, negative = penalty
  category: 'intent' | 'fit' | 'momentum' | 'buying_readiness';
}

export type ScoreTier = 'Dormant' | 'Exploring' | 'Engaged' | 'Qualified' | 'Sales Ready';

// ---------------------------------------------------------------------------
// Conversations Table
// ---------------------------------------------------------------------------
export interface Conversation {
  id: string;
  phone: string;
  lead_id: string;
  history: string; // Full conversation log as text
  stage: LeadStage;
  turn_count: number;
  summary: string;
  last_updated: string; // ISO timestamp
  last_user_message: string;
  last_bot_message: string;
  last_action: string;
  alert_sent: boolean;
  meeting_link_sent: boolean;
  brochure_sent: boolean;
  last_alert_reason: string;
  last_signal: string;
  locked_until: string; // ISO timestamp
  created_at: string; // ISO timestamp
}

// ---------------------------------------------------------------------------
// Parsed message from conversation history
// ---------------------------------------------------------------------------
export interface Message {
  id: string;
  sender: 'bot' | 'lead';
  content: string;
  timestamp: string; // ISO timestamp
}

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------
export interface Appointment {
  id: string;
  lead_id: string;
  lead_name: string;
  phone: string;
  date: string; // ISO date
  time: string; // HH:mm
  status: 'qc_confirmed' | 'ai_booked' | 'meeting_scheduled';
  meeting_link: string;
  conversation_summary: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Knowledge Base Documents
// ---------------------------------------------------------------------------
export interface KnowledgeDoc {
  id: string;
  title: string;
  filename: string;
  category: 'Product Doc' | 'Case Study' | 'Competitor Intel' | 'Sales Tactic';
  industry_tag: string;
  date_added: string; // ISO timestamp
  uploaded_by: string;
  file_size: number; // bytes
  status: 'processing' | 'ready' | 'failed';
}

// ---------------------------------------------------------------------------
// Unanswered Questions (Knowledge Gap Detector)
// ---------------------------------------------------------------------------
export interface UnansweredQuestion {
  id: string;
  question: string;
  lead_name: string;
  lead_id: string;
  asked_at: string; // ISO timestamp
  similarity_score: number; // 0-1, lower = worse match
  times_asked: number;
}

// ---------------------------------------------------------------------------
// Users & Roles
// ---------------------------------------------------------------------------
export type UserRole = 'admin' | 'ceo' | 'country_head' | 'sales_head' | 'sales_rep';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'invited' | 'disabled';
  country?: string; // For country_head scoping
  last_login: string; // ISO timestamp
  created_at: string;
  avatar_url?: string;
}

export interface Permission {
  module: PermissionModule;
  actions: PermissionAction[];
}

export type PermissionModule =
  | 'leads'
  | 'whatsapp'
  | 'appointments'
  | 'knowledge_base'
  | 'users'
  | 'roles'
  | 'settings';

export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'export'
  | 'manage'
  | 'upload'
  | 'take_over';

export interface RolePermissions {
  role: UserRole;
  label: string;
  permissions: Permission[];
}

// ---------------------------------------------------------------------------
// Activity Feed Events
// ---------------------------------------------------------------------------
export interface ActivityEvent {
  id: string;
  type: 'new_lead' | 'reply' | 'meeting_booked' | 'dnc' | 'stage_change' | 'alert' | 'knowledge_upload';
  message: string;
  lead_name?: string;
  lead_id?: string;
  timestamp: string; // ISO timestamp
  icon: string; // emoji
}

// ---------------------------------------------------------------------------
// Dashboard KPIs
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// System Health
// ---------------------------------------------------------------------------
export interface SystemStatus {
  status: 'healthy' | 'degraded' | 'down';
  last_checked: string; // ISO timestamp
  message: string;
}

// ---------------------------------------------------------------------------
// Filters & Params
// ---------------------------------------------------------------------------
export interface LeadFilters {
  stage?: LeadStage | 'ALL';
  tier?: ScoreTier | 'ALL';
  period?: 'today' | 'this_week' | 'this_month' | 'all_time';
  search?: string;
  country?: string;
  owner?: string;
}

export interface DateRange {
  start: string; // ISO date
  end: string;   // ISO date
}
