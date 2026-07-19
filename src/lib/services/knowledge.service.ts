import { KnowledgeDoc, UnansweredQuestion } from '../types';
import { supabase } from '../supabase';

export async function getKnowledgeDocuments(): Promise<KnowledgeDoc[]> {
  const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  
  return data.map((doc: any) => ({
    id: doc.id,
    title: doc.title || doc.file_name || 'Document',
    filename: doc.file_name || doc.filename || 'unknown',
    category: (doc.category || 'Product Doc') as any,
    industry_tag: doc.industry || 'General',
    date_added: doc.uploaded_at || doc.created_at || new Date().toISOString(),
    uploaded_by: doc.uploaded_by || 'Unknown',
    file_size: doc.file_size || 0,
    status: (doc.status === 'uploaded' ? 'ready' : doc.status || 'ready') as any
  }));
}

export async function getUnansweredQuestions(): Promise<UnansweredQuestion[]> {
  return [];
}
