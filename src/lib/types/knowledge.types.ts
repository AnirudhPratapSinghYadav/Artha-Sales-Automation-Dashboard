export interface KnowledgeDoc {
  id: string;
  title: string;
  filename: string;
  category: 'Product Doc' | 'Case Study' | 'Competitor Intel' | 'Sales Tactic';
  industry_tag: string;
  date_added: string;
  uploaded_by: string;
  file_size: number;
  status: 'processing' | 'ready' | 'failed';
}

export interface UnansweredQuestion {
  id: string;
  question: string;
  lead_name: string;
  lead_id: string;
  asked_at: string;
  similarity_score: number;
  times_asked: number;
}
