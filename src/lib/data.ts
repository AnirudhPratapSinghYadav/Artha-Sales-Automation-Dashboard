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

// ---------------------------------------------------------------------------
// Helper: simulate async fetch
// ---------------------------------------------------------------------------
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------
export async function getLeads(filters?: LeadFilters): Promise<Lead[]> {
  // TODO: Replace with Supabase query
  // const { data } = await supabase.from('leads').select('*')
  await delay(100);
  let leads = [...mockLeads];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    leads = leads.filter(
      l =>
        l.first_name.toLowerCase().includes(q) ||
        l.last_name.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.email.toLowerCase().includes(q)
    );
  }

  if (filters?.stage && filters.stage !== 'ALL') {
    leads = leads.filter(l => l.stage === filters.stage);
  }

  if (filters?.tier && filters.tier !== 'ALL') {
    leads = leads.filter(l => l.signals.tier === filters.tier);
  }

  if (filters?.country) {
    leads = leads.filter(l => l.country === filters.country);
  }

  return leads;
}

export async function getLead(id: string): Promise<Lead | null> {
  // TODO: Replace with Supabase query
  await delay(50);
  return mockLeads.find(l => l.id === id) || null;
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
  // TODO: Replace with Supabase query
  await delay(100);
  if (leadId) {
    return mockConversations.filter(c => c.lead_id === leadId);
  }
  return [...mockConversations];
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  // TODO: Replace with Supabase query + parse
  await delay(50);
  const conv = mockConversations.find(c => c.id === conversationId);
  if (!conv) return [];
  return parseConversationMessages(conv);
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
import { supabase } from './supabase';

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
