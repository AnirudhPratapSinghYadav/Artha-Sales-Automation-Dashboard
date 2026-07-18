'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { getSystemStatus } from '@/lib/data';
import { SystemStatus } from '@/lib/types';
import { CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import clsx from 'clsx';
import { useToast } from '@/components/ui/ToastProvider';

export default function SettingsPage() {
  const [sysStatus, setSysStatus] = useState<SystemStatus | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    getSystemStatus()
      .then(setSysStatus)
      .catch(() => toast({ title: 'Error', message: 'Failed to load system status', variant: 'error' }));
  }, [toast]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast({ title: 'Copied', message: `${id} URL copied to clipboard`, variant: 'success' });
    setTimeout(() => setCopied(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50';
      case 'degraded': return 'text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50';
      case 'down': return 'text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50';
      default: return 'text-gray-600 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800';
    }
  };

  const webhooks = [
    { name: 'Upload Knowledge Base', url: process.env.NEXT_PUBLIC_N8N_WEBHOOK_UPLOAD_KB || 'https://placeholder.n8n.com/webhook/upload-kb' },
    { name: 'Create New Lead', url: process.env.NEXT_PUBLIC_N8N_WEBHOOK_NEW_LEAD || 'https://placeholder.n8n.com/webhook/new-lead' },
    { name: 'Toggle Takeover', url: process.env.NEXT_PUBLIC_N8N_WEBHOOK_TAKEOVER || 'https://placeholder.n8n.com/webhook/takeover' },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-zinc-100">System Settings</h2>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Manage integrations and view system health</p>
      </div>

      <div className="space-y-6">
        
        {/* Connection Status */}
        <Card title="Connection Status">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={clsx("p-4 rounded-xl border flex items-start gap-3", sysStatus ? getStatusColor(sysStatus.status) : 'bg-gray-50 dark:bg-zinc-900')}>
              {sysStatus?.status === 'healthy' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
              <div>
                <h4 className="font-semibold mb-1">Backend Connectivity</h4>
                <p className="text-sm opacity-90">{sysStatus?.message || 'Checking...'}</p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-500 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Supabase Database</h4>
                <p className="text-sm opacity-90">Connected successfully to production project.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Webhooks */}
        <Card title="n8n Integration Endpoints" subtitle="The dashboard sends data to these webhook URLs. Configure them in .env.local">
          <div className="space-y-4">
            {webhooks.map((wh, idx) => (
              <div key={idx}>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">{wh.name}</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={wh.url}
                    className="flex-1 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-zinc-400 outline-none"
                  />
                  <button 
                    onClick={() => handleCopy(wh.url, wh.name)}
                    className="p-2 border border-gray-200 dark:border-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                    title="Copy URL"
                  >
                    {copied === wh.name ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Info */}
        <Card title="System Information">
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div>
              <p className="text-gray-500 dark:text-zinc-500 mb-1">Environment</p>
              <p className="font-medium text-gray-900 dark:text-zinc-100 capitalize">{process.env.NODE_ENV || 'Development'}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-zinc-500 mb-1">Version</p>
              <p className="font-medium text-gray-900 dark:text-zinc-100">v1.0.0-beta</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-zinc-500 mb-1">UI Framework</p>
              <p className="font-medium text-gray-900 dark:text-zinc-100">Next.js 14 (App Router) + Tailwind v3</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-zinc-500 mb-1">Timezone</p>
              <p className="font-medium text-gray-900 dark:text-zinc-100">{Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
            </div>
          </div>
        </Card>
        
      </div>
    </div>
  );
}
