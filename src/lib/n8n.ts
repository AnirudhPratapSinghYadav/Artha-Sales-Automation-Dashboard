// =============================================================================
// Artha Sales Automation — Secure API Proxies to n8n Webhooks
// =============================================================================

import { getAuthHeader } from './auth';

const FETCH_TIMEOUT_MS = 15000; // 15 seconds

async function fetchWithTimeout(resource: RequestInfo | URL, options: RequestInit = {}) {
  const { timeout = FETCH_TIMEOUT_MS } = options as any;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);

  return response;
}

/**
 * Upload a file to the knowledge base via internal API gateway.
 */
export async function uploadKnowledgeDocument(file: File, category: string): Promise<{ success: boolean; message: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const headers: Record<string, string> = {};
    const authHeader = await getAuthHeader();
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetchWithTimeout('/api/kb/upload', {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `Upload failed: ${response.statusText}`);
    }

    return { success: true, message: data.message || 'Added to knowledge base' };
  } catch (error) {
    console.error('Knowledge upload error:', error);
    if ((error as any).name === 'AbortError') {
      return { success: false, message: 'Upload request timed out' };
    }
    return { success: false, message: error instanceof Error ? error.message : 'Upload failed' };
  }
}

/**
 * Create a new lead via internal API gateway.
 */
export async function createLead(leadData: Record<string, string>): Promise<{ success: boolean; message: string }> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const authHeader = await getAuthHeader();
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetchWithTimeout('/api/leads/create', {
      method: 'POST',
      headers,
      body: JSON.stringify(leadData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `Lead creation failed: ${response.statusText}`);
    }

    return { success: true, message: data.message || 'Lead created successfully' };
  } catch (error) {
    console.error('Lead creation error:', error);
    if ((error as any).name === 'AbortError') {
      return { success: false, message: 'Lead creation request timed out' };
    }
    return { success: false, message: error instanceof Error ? error.message : 'Failed to create lead' };
  }
}

/**
 * Toggle human takeover for a conversation via internal API gateway.
 */
export async function toggleTakeover(
  leadId: string,
  phone: string,
  takeOver: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const authHeader = await getAuthHeader();
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetchWithTimeout('/api/whatsapp/takeover', {
      method: 'POST',
      headers,
      body: JSON.stringify({ lead_id: leadId, phone, human_takeover: takeOver }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `Takeover toggle failed: ${response.statusText}`);
    }

    return {
      success: true,
      message: data.message || (takeOver ? 'You\'ve taken over this conversation' : 'Bot resumed for this conversation'),
    };
  } catch (error) {
    console.error('Takeover toggle error:', error);
    if ((error as any).name === 'AbortError') {
      return { success: false, message: 'Takeover request timed out' };
    }
    return { success: false, message: error instanceof Error ? error.message : 'Toggle failed' };
  }
}
