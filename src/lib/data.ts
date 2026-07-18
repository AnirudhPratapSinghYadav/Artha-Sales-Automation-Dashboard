// =============================================================================
// Artha Sales Automation — Data Fetching Abstraction Layer
// Each function returns mock data now; swap to Supabase/n8n calls later.
// =============================================================================

import {
  Lead,
  Conversation,
  Message,
  Appointment,
  KnowledgeDoc,
  UnansweredQuestion,
  User,
  ActivityEvent,
  DashboardKPIs,
  TrendDataPoint,
  LeadDistribution,
  SystemStatus,
  RolePermissions,
  LeadFilters,
  DateRange,
  ScoreTier,
} from './types';

import {
  mockLeads,
  mockConversations,
  parseConversationMessages,
  mockAppointments,
  mockKnowledgeDocs,
  mockUnansweredQuestions,
  mockUsers,
  mockActivityFeed,
  mockDashboardKPIs,
  mockTrendData,
  mockLeadDistribution,
  mockSystemStatus,
  mockRolePermissions,
} from './mock-data';
import { supabase } from './supabase';

// ---------------------------------------------------------------------------
// Helper: simulate async fetch
// ---------------------------------------------------------------------------
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function mapSupabaseLeadToUI(row: any): Lead {
  return {
    ...row,
    signals: {
      intent_score: row.intent_score || 0,
      fit_score: row.fit_score || 0,
      momentum_score: row.momentum_score || 0,
      buying_readiness: row.buying_readiness_score || 0,
      overall_score: row.lead_score_total || 0,
      tier: row.lead_score_band || getLeadTier(row.lead_score_total || 0),
      detected_signals: row.signals && Array.isArray(row.signals) ? row.signals : []
    }
  } as Lead;
}

function parseHistoryToMessages(history: string, last_updated: string): Message[] {
  const lines = history.split('\n');
  const messages: Message[] = [];
  
  lines.forEach((line, index) => {
    line = line.trim();
    if (!line) return;
    
    let sender: 'bot' | 'lead' = 'bot';
    let content = line;
    
    if (line.toLowerCase().startsWith('prospect')) {
      sender = 'lead';
      content = line.replace(/^Prospect[^:]*:\s*/i, '');
    } else if (line.toLowerCase().startsWith('maya') || line.toLowerCase().startsWith('bot')) {
      sender = 'bot';
      content = line.replace(/^(Maya|Bot)[^:]*:\s*/i, '');
    }
    
    messages.push({
      id: `msg_${index}`,
      sender,
      content,
      timestamp: new Date(new Date(last_updated || new Date()).getTime() - (lines.length - index) * 60000).toISOString()
    });
  });
  
  return messages;
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------
export async function getLeads(filters?: LeadFilters): Promise<Lead[]> {
  let query = supabase.from('leads').select('*');

  if (filters?.search) {
    query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,company.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }

  if (filters?.stage && filters.stage !== 'ALL') {
    query = query.eq('stage', filters.stage);
  }

  if (filters?.tier && filters.tier !== 'ALL') {
    query = query.eq('lead_score_band', filters.tier);
  }

  if (filters?.country) {
    query = query.eq('country', filters.country);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }

  return (data || []).map(mapSupabaseLeadToUI);
}

export async function getLead(id: string): Promise<Lead | null> {
  const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();
  if (error || !data) return null;
  return mapSupabaseLeadToUI(data);
}

export function getLeadTier(overallScore: number): ScoreTier {
  if (overallScore >= 86) return 'Sales Ready';
  if (overallScore >= 71) return 'Qualified';
  if (overallScore >= 46) return 'Engaged';
  if (overallScore >= 21) return 'Exploring';
  return 'Dormant';
}

export function getTierColor(tier: ScoreTier): string {
  switch (tier) {
    case 'Sales Ready': return 'bg-green-100 text-green-700';
    case 'Qualified': return 'bg-orange-100 text-orange-700';
    case 'Engaged': return 'bg-amber-100 text-amber-700';
    case 'Exploring': return 'bg-blue-100 text-blue-700';
    case 'Dormant': return 'bg-gray-100 text-gray-600';
  }
}

export function getTierDotColor(tier: ScoreTier): string {
  switch (tier) {
    case 'Sales Ready': return 'bg-green-500';
    case 'Qualified': return 'bg-orange-500';
    case 'Engaged': return 'bg-amber-500';
    case 'Exploring': return 'bg-blue-500';
    case 'Dormant': return 'bg-gray-400';
  }
}

// ---------------------------------------------------------------------------
// Conversations
// ---------------------------------------------------------------------------
export async function getConversations(leadId?: string): Promise<Conversation[]> {
  let query = supabase.from('conversations').select('*');
  if (leadId) {
    query = query.eq('lead_id', leadId);
  }
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
  return data as Conversation[];
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase.from('conversations').select('history, last_updated').eq('id', conversationId).single();
  if (error || !data || !data.history) return [];
  return parseHistoryToMessages(data.history, data.last_updated);
}

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------
export async function getAppointments(dateRange?: DateRange): Promise<Appointment[]> {
  // TODO: Replace with Supabase query
  await delay(100);
  if (dateRange) {
    return mockAppointments.filter(a => a.date >= dateRange.start && a.date <= dateRange.end);
  }
  return [...mockAppointments];
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
export async function getDashboardKPIs(period?: string): Promise<DashboardKPIs> {
  // TODO: Replace with Supabase aggregation query
  await delay(100);
  return { ...mockDashboardKPIs };
}

export async function getLeadTrend(period?: string): Promise<TrendDataPoint[]> {
  // TODO: Replace with Supabase query
  await delay(100);
  return [...mockTrendData];
}

export async function getLeadDistributionData(): Promise<LeadDistribution[]> {
  // TODO: Replace with Supabase query
  await delay(50);
  return [...mockLeadDistribution];
}

export async function getActivityFeed(limit: number = 15): Promise<ActivityEvent[]> {
  // TODO: Replace with Supabase query
  await delay(100);
  return mockActivityFeed.slice(0, limit);
}

// ---------------------------------------------------------------------------
// Knowledge Base
// ---------------------------------------------------------------------------
export async function getKnowledgeDocuments(): Promise<KnowledgeDoc[]> {
  // TODO: Replace with Supabase query
  await delay(100);
  return [...mockKnowledgeDocs];
}

export async function getUnansweredQuestions(): Promise<UnansweredQuestion[]> {
  // TODO: Replace with Supabase query
  await delay(100);
  return [...mockUnansweredQuestions];
}

// ---------------------------------------------------------------------------
// Users & Roles
// ---------------------------------------------------------------------------
export async function getUsers(): Promise<User[]> {
  // TODO: Replace with Supabase query
  await delay(100);
  return [...mockUsers];
}

export async function getRolePermissions(): Promise<RolePermissions[]> {
  // TODO: Replace with Supabase query or config
  await delay(50);
  return [...mockRolePermissions];
}

// ---------------------------------------------------------------------------
// System Status
// ---------------------------------------------------------------------------
export async function getSystemStatus(): Promise<SystemStatus> {
  // TODO: Replace with Supabase query to system_status table
  await delay(50);
  return { ...mockSystemStatus };
}

// ---------------------------------------------------------------------------
// Supabase Realtime Subscriptions
// ---------------------------------------------------------------------------

export function subscribeToLeads(callback: (payload: any) => void) {
  return supabase
    .channel('public:leads')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, callback)
    .subscribe();
}

export function subscribeToConversations(leadId: string | null, callback: (payload: any) => void) {
  let filter = 'public:conversations';
  if (leadId) {
    filter = `public:conversations:lead_id=eq.${leadId}`;
  }
  
  return supabase
    .channel(filter)
    .on(
      'postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'conversations',
        ...(leadId ? { filter: `lead_id=eq.${leadId}` } : {}) 
      }, 
      callback
    )
    .subscribe();
}

export function subscribeToAppointments(callback: (payload: any) => void) {
  return supabase
    .channel('public:appointments')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, callback)
    .subscribe();
}
