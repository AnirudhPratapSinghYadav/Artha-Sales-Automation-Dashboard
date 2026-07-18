import * as Types from '../types';

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000).toISOString();

export const mockAppointments: Types.Appointment[] = [
  {
    id: 'A001',
    lead_id: 'L002',
    lead_name: 'Sarah Tan',
    phone: '6591234567',
    date: new Date(now.getTime() + 2 * 86400000).toISOString().split('T')[0],
    time: '14:00',
    status: 'ai_booked',
    meeting_link: 'https://meet.google.com/abc-defg-hij',
    conversation_summary: 'Sarah needs a CDP. Will bring Head of Engineering.',
    created_at: daysAgo(2),
  },
  {
    id: 'A002',
    lead_id: 'L003',
    lead_name: 'Omar Al Hammadi',
    phone: '971501234567',
    date: new Date(now.getTime() + 4 * 86400000).toISOString().split('T')[0],
    time: '10:00',
    status: 'ai_booked',
    meeting_link: 'https://meet.google.com/klm-nopq-rst',
    conversation_summary: 'Omar needs CBUAE compliance support.',
    created_at: hoursAgo(18),
  },
  {
    id: 'A003',
    lead_id: 'L009',
    lead_name: 'Vikram Desai',
    phone: '919876123456',
    date: new Date(now.getTime() + 1 * 86400000).toISOString().split('T')[0],
    time: '11:00',
    status: 'qc_confirmed',
    meeting_link: 'https://meet.google.com/uvw-xyz1-234',
    conversation_summary: 'Vikram has RFP for vendor-agnostic data platform. Will share RFP draft.',
    created_at: daysAgo(1),
  },
  {
    id: 'A004',
    lead_id: 'L012',
    lead_name: 'Fatima Al Zahra',
    phone: '971552345678',
    date: new Date(now.getTime() + 5 * 86400000).toISOString().split('T')[0],
    time: '15:00',
    status: 'meeting_scheduled',
    meeting_link: 'https://meet.google.com/567-890a-bcd',
    conversation_summary: 'CDO requesting CEO-level meeting. Q3 governance implementation target.',
    created_at: hoursAgo(10),
  },
  {
    id: 'A005',
    lead_id: 'L001',
    lead_name: 'Rajesh Kumar',
    phone: '6281234567890',
    date: new Date(now.getTime() + 1 * 86400000).toISOString().split('T')[0],
    time: '15:30',
    status: 'ai_booked',
    meeting_link: 'https://meet.google.com/efg-hijk-lmn',
    conversation_summary: 'Compliance-focused demo. Solutions architect team joining.',
    created_at: hoursAgo(6),
  },
  {
    id: 'A006',
    lead_id: 'L020',
    lead_name: 'Mohammed Al Rashid',
    phone: '966551234567',
    date: new Date(now.getTime() + 3 * 86400000).toISOString().split('T')[0],
    time: '09:00',
    status: 'meeting_scheduled',
    meeting_link: 'https://meet.google.com/opq-rstu-vwx',
    conversation_summary: 'On-premise deployment discussion for Saudi Aramco.',
    created_at: daysAgo(1),
  },
  {
    id: 'A007',
    lead_id: 'L024',
    lead_name: 'Rashid Khan',
    phone: '97339876543',
    date: new Date(now.getTime() - 2 * 86400000).toISOString().split('T')[0],
    time: '13:00',
    status: 'qc_confirmed',
    meeting_link: 'https://meet.google.com/yza-bcde-fgh',
    conversation_summary: 'Core banking migration assessment.',
    created_at: daysAgo(5),
  },
];

// ---------------------------------------------------------------------------
// KNOWLEDGE BASE DOCUMENTS
// ---------------------------------------------------------------------------

