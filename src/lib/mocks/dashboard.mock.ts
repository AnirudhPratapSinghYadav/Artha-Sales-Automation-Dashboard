import * as Types from '../types';

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000).toISOString();

export const mockActivityFeed: Types.ActivityEvent[] = [
  { id: 'E001', type: 'new_lead', message: 'New lead added: Putri Wijaya (Gojek)', lead_name: 'Putri Wijaya', lead_id: 'L023', timestamp: hoursAgo(20), icon: '🟢' },
  { id: 'E002', type: 'reply', message: 'Maya replied to Rajesh Kumar', lead_name: 'Rajesh Kumar', lead_id: 'L001', timestamp: hoursAgo(6), icon: '💬' },
  { id: 'E003', type: 'meeting_booked', message: 'Meeting booked with Omar Al Hammadi', lead_name: 'Omar Al Hammadi', lead_id: 'L003', timestamp: hoursAgo(18), icon: '📅' },
  { id: 'E004', type: 'stage_change', message: 'Rajesh Kumar moved to QUALIFIED', lead_name: 'Rajesh Kumar', lead_id: 'L001', timestamp: hoursAgo(8), icon: '⬆️' },
  { id: 'E005', type: 'reply', message: 'Maya replied to Arjun Reddy', lead_name: 'Arjun Reddy', lead_id: 'L027', timestamp: hoursAgo(3), icon: '💬' },
  { id: 'E006', type: 'alert', message: 'Handoff alert: Fatima Al Zahra requested CEO meeting', lead_name: 'Fatima Al Zahra', lead_id: 'L012', timestamp: hoursAgo(10), icon: '🔔' },
  { id: 'E007', type: 'reply', message: 'Maya replied to Li Wei', lead_name: 'Li Wei', lead_id: 'L018', timestamp: hoursAgo(4), icon: '💬' },
  { id: 'E008', type: 'stage_change', message: 'Vikram Desai moved to MEETING_BOOKED', lead_name: 'Vikram Desai', lead_id: 'L009', timestamp: daysAgo(1), icon: '⬆️' },
  { id: 'E009', type: 'knowledge_upload', message: 'New document uploaded: Sales Objection Handling Playbook', timestamp: daysAgo(5), icon: '📁' },
  { id: 'E010', type: 'dnc', message: 'DNC: lead opted out — Jessica Morgan', lead_name: 'Jessica Morgan', lead_id: 'L008', timestamp: daysAgo(25), icon: '🔴' },
  { id: 'E011', type: 'reply', message: 'Maya replied to Fatima Al Zahra', lead_name: 'Fatima Al Zahra', lead_id: 'L012', timestamp: hoursAgo(10), icon: '💬' },
  { id: 'E012', type: 'new_lead', message: 'New lead added: Thuy Nguyen (VPBank)', lead_name: 'Thuy Nguyen', lead_id: 'L028', timestamp: daysAgo(2), icon: '🟢' },
  { id: 'E013', type: 'meeting_booked', message: 'Meeting booked with Sarah Tan', lead_name: 'Sarah Tan', lead_id: 'L002', timestamp: daysAgo(2), icon: '📅' },
  { id: 'E014', type: 'reply', message: 'Maya replied to Deepak Mehta', lead_name: 'Deepak Mehta', lead_id: 'L015', timestamp: daysAgo(1), icon: '💬' },
  { id: 'E015', type: 'alert', message: 'Alert: Vikram Desai shared RFP document', lead_name: 'Vikram Desai', lead_id: 'L009', timestamp: daysAgo(1), icon: '🔔' },
];

// ---------------------------------------------------------------------------
// DASHBOARD KPIs
// ---------------------------------------------------------------------------

export const mockDashboardKPIs: Types.DashboardKPIs = {
  total_leads: 30,
  new_leads: 5,
  sales_ready: 5,
  qualified: 6,
  meetings_booked: 4,
  active_conversations: 22,
};

// ---------------------------------------------------------------------------
// TREND DATA
// ---------------------------------------------------------------------------

export const mockTrendData: Types.TrendDataPoint[] = [
  { date: daysAgo(28).split('T')[0], value: 12 },
  { date: daysAgo(24).split('T')[0], value: 15 },
  { date: daysAgo(21).split('T')[0], value: 18 },
  { date: daysAgo(17).split('T')[0], value: 14 },
  { date: daysAgo(14).split('T')[0], value: 22 },
  { date: daysAgo(10).split('T')[0], value: 28 },
  { date: daysAgo(7).split('T')[0], value: 25 },
  { date: daysAgo(3).split('T')[0], value: 32 },
  { date: daysAgo(0).split('T')[0], value: 30 },
];

// ---------------------------------------------------------------------------
// LEAD DISTRIBUTION
// ---------------------------------------------------------------------------

export const mockLeadDistribution: Types.LeadDistribution[] = [
  { tier: 'Sales Ready', count: 5, color: '#22C55E' },
  { tier: 'Qualified', count: 6, color: '#F97316' },
  { tier: 'Engaged', count: 8, color: '#F59E0B' },
  { tier: 'Exploring', count: 5, color: '#3B82F6' },
  { tier: 'Dormant', count: 6, color: '#9CA3AF' },
];

// ---------------------------------------------------------------------------
// SYSTEM STATUS
// ---------------------------------------------------------------------------

