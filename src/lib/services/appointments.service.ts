import { supabase } from '../supabase';
import { Appointment, DateRange } from '../types';
import { mockAppointments } from '../mocks';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAppointments(dateRange?: DateRange): Promise<Appointment[]> {
  await delay(100);
  if (dateRange) {
    return mockAppointments.filter(a => a.date >= dateRange.start && a.date <= dateRange.end);
  }
  return [...mockAppointments];
}

export function subscribeToAppointments(callback: (payload: any) => void) {
  return supabase
    .channel('public:appointments')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, callback)
    .subscribe();
}
