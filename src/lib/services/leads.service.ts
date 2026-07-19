import { supabase } from '../supabase';
import { Lead, LeadFilters, ScoreTier } from '../types';



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

  return (data || []) as Lead[];
}

export async function getLead(id: string): Promise<Lead | null> {
  const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();
  if (error || !data) return null;
  return (data as Lead) || null;
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

export function subscribeToLeads(callback: (payload: any) => void) {
  return supabase
    .channel('public:leads')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, callback)
    .subscribe();
}
