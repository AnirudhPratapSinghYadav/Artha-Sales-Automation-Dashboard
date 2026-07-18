'use client';

import React from 'react';
import { KnowledgeDoc } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Eye, Trash2, FileText, FileSearch, FileBarChart, FileCode2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/ToastProvider';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import clsx from 'clsx';
import { useState } from 'react';

interface DocumentsTableProps {
  documents: KnowledgeDoc[];
  canDelete: boolean;
}

export function DocumentsTable({ documents, canDelete }: DocumentsTableProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<{id: string, title: string} | null>(null);
  const { toast } = useToast();
  
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Product Doc': return <Badge variant="exploring" className="bg-blue-100 text-blue-700">{category}</Badge>;
      case 'Case Study': return <Badge variant="sales-ready" className="bg-green-100 text-green-700">{category}</Badge>;
      case 'Competitor Intel': return <Badge variant="dormant" className="bg-red-100 text-red-700">{category}</Badge>;
      case 'Sales Tactic': return <Badge variant="engaged" className="bg-amber-100 text-amber-700">{category}</Badge>;
      default: return <Badge variant="dormant">{category}</Badge>;
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'Product Doc': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'Case Study': return <FileBarChart className="w-5 h-5 text-green-500" />;
      case 'Competitor Intel': return <FileSearch className="w-5 h-5 text-red-500" />;
      case 'Sales Tactic': return <FileCode2 className="w-5 h-5 text-amber-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleDelete = (id: string, title: string) => {
    setDocToDelete({ id, title });
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!docToDelete) return;
    setConfirmOpen(false);
    toast({
      title: 'Document Deleted',
      message: `Deleted ${docToDelete.title}`,
    });
    setDocToDelete(null);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm mb-6">
      <ConfirmDialog 
        isOpen={confirmOpen}
        title="Delete Document"
        message={`Are you sure you want to delete "${docToDelete?.title}"?\nThis will remove it from Maya's knowledge immediately.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        variant="danger"
      />
      <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Active Documents</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Document</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Category</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Target Industry</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Date Added</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-zinc-400">No documents found.</td>
              </tr>
            ) : (
              documents.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {getIcon(doc.category)}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">{doc.title}</p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">By {doc.uploaded_by}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getCategoryBadge(doc.category)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">{doc.industry_tag || 'Any'}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-900 dark:text-zinc-100">{format(parseISO(doc.date_added), 'MMM d, yyyy')}</p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        title="View Document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {canDelete && (
                        <button 
                          onClick={() => handleDelete(doc.id, doc.title)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
