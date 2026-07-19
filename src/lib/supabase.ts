// =============================================================================
// Artha Sales Automation — Supabase Client
// =============================================================================

import { createClient } from '@supabase/supabase-js';

// Get env vars, strip quotes in case user accidentally added them in Vercel
const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/['"]/g, '').trim();
const rawKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/['"]/g, '').trim();

const supabaseUrl = rawUrl.startsWith('http') ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = rawKey || 'placeholder-anon-key';

// Ensure the client never throws synchronously during module initialization
export const supabase = (() => {
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('Failed to initialize Supabase client:', e);
    // Return a dummy client that doesn't crash the app but fails gracefully on fetches
    return createClient('https://placeholder.supabase.co', 'placeholder-anon-key');
  }
})();
