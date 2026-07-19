// =============================================================================
// Artha Sales Automation — Supabase Client
// =============================================================================

import { createClient } from '@supabase/supabase-js';

// Get env vars, strip quotes in case user accidentally added them in Vercel
const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/['"]/g, '').trim();
const rawKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/['"]/g, '').trim();

export const isSupabaseConfigured = rawUrl.startsWith('http') && rawKey.length > 0;

// Create a valid client if configured, otherwise create a dummy client to prevent synchronous crashes during import.
// The UI will use isSupabaseConfigured to show a setup screen instead of crashing or failing silently.
const supabaseUrl = isSupabaseConfigured ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = isSupabaseConfigured ? rawKey : 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
