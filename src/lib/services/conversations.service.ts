import { supabase } from '../supabase';
import { Conversation, Message } from '../types';

export function parseHistoryToMessages(history: string, last_updated: string): Message[] {
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
