import { KnowledgeDoc, UnansweredQuestion } from '../types';
import { supabase } from '../supabase';

export async function getKnowledgeDocuments(): Promise<KnowledgeDoc[]> {
  const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  
  return data.map((doc: any) => ({
    id: doc.id,
    filename: doc.filename || 'Document',
    type: doc.type || 'text',
    upload_date: doc.created_at,
    size: doc.size || 'Unknown',
    status: 'active' as const
  }));
}

export async function getUnansweredQuestions(): Promise<UnansweredQuestion[]> {
  return [];
}
