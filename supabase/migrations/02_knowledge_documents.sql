-- Drop existing if it doesn't match the new schema
DROP TABLE IF EXISTS knowledge_documents;

CREATE TABLE knowledge_documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name text,
  category text,
  status text,
  error_message text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Note: RLS policies or other indexes should be added if needed.
