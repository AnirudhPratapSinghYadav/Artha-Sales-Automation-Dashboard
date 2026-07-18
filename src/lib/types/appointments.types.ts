export interface Appointment {
  id: string;
  lead_id: string;
  lead_name: string;
  phone: string;
  date: string;
  time: string;
  status: 'qc_confirmed' | 'ai_booked' | 'meeting_scheduled';
  meeting_link: string;
  conversation_summary: string;
  created_at: string;
}
