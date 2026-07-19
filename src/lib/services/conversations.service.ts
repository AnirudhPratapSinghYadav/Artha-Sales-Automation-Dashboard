import { supabase } from '../supabase';
import { Conversation, Message } from '../types';

export async function getConversations(leadId?: string): Promise<Conversation[]> {
  let query = supabase.from('conversations').select('*');
  if (leadId) {
    query = query.eq('lead_id', leadId);
  }
  const { data, error } = await query;
  if (error) {
    console.error('getConversations error:', error);
    return [];
  }
  return data || [];
}

export async function getMessages(phone: string): Promise<Message[]> {
  const { data: conv } = await supabase.from('conversations').select('history').eq('phone', phone).single();
  if (!conv?.history) return [];
  
  const lines = conv.history.split('\n').filter(Boolean);
  const messages: Message[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const prospectMatch = line.match(/^Prospect \[T(\d+)\]: (.*)$/i);
    const mayaMatch = line.match(/^(?:Maya|Bot) \[T(\d+)\]: (.*)$/i);
    
    if (prospectMatch) {
      messages.push({ id: `msg_${i}`, sender: 'lead', content: prospectMatch[2], timestamp: new Date().toISOString() }); // keeping id and timestamp to satisfy UI for now
    } else if (mayaMatch) {
      messages.push({ id: `msg_${i}`, sender: 'bot', content: mayaMatch[2], timestamp: new Date().toISOString() });
    } else {
      // Fallback for older format if any
      const sender = line.toLowerCase().startsWith('prospect') ? 'lead' : 'bot';
      const content = line.replace(/^(Prospect|Maya|Bot)[^:]*:\s*/i, '');
      messages.push({ id: `msg_${i}`, sender, content, timestamp: new Date().toISOString() });
    }
  }
  return messages;
}

export function subscribeToConversations(phone: string | null, callback: (payload: any) => void) {
  // Use a unique topic name to avoid React 18 StrictMode setup/cleanup race conditions
  const uniqueSuffix = Math.random().toString(36).substring(7);
  let topicName = `public:conversations-${uniqueSuffix}`;
  if (phone) {
    topicName = `public:conversations:phone=eq.${phone}-${uniqueSuffix}`;
  }
  
  const channel = supabase.channel(topicName);
  
  channel.on(
    'postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'conversations',
      ...(phone ? { filter: `phone=eq.${phone}` } : {}) 
    }, 
    callback
  ).subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
