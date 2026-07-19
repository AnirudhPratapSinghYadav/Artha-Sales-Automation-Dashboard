'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getKnowledgeDocuments } from '@/lib/data';
import { KnowledgeDoc } from '@/lib/types';
import { UploadZone } from '@/components/knowledge/UploadZone';
import { DocumentsTable } from '@/components/knowledge/DocumentsTable';

import { TableSkeleton, CardSkeleton } from '@/components/ui/Skeletons';
import { Database } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

export default function KnowledgeBasePage() {
  const { canAccessModule } = useAuth();
  const { toast } = useToast();
  const canUpload = canAccessModule('knowledge_base'); // In a real app, check specific 'upload' action
  
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const docs = await getKnowledgeDocuments();
        setDocuments(docs);
      } catch (err) {
        toast({ title: 'Error', message: 'Failed to load knowledge base data', variant: 'error' });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [toast]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto pb-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-lg" />
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded w-32" />
            <div className="h-4 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded w-64" />
          </div>
        </div>
        
        {canUpload && (
          <div className="border-2 border-dashed border-gray-200 dark:border-zinc-850 rounded-xl p-8 h-32 animate-pulse bg-gray-50/50 dark:bg-zinc-900/50" />
        )}
        
        <TableSkeleton rows={4} />
        
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
          <Database className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-zinc-100">Knowledge Base</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Manage documents that train Maya's RAG system</p>
        </div>
      </div>

      {canUpload && <UploadZone />}

      <DocumentsTable documents={documents} canDelete={canUpload} />



      <p className="text-xs text-gray-400 dark:text-zinc-500 text-center mt-8">
        Changes to the knowledge base are live within seconds — no need to restart anything.
      </p>
    </div>
  );
}
