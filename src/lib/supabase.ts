import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

/**
 * Returns the shared Supabase client, or null if env vars are missing.
 * Feature code must check for null and degrade gracefully.
 */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!client) {
    client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        storageKey: 'finx_dev_session',
        storage: window.sessionStorage,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}

/**
 * Returns the Supabase client scoped to the `finx` schema.
 * Throws if Supabase is not configured — callers should check
 * `isSupabaseConfigured()` first.
 */
export function getFinxClient() {
  const sb = getSupabase();
  if (!sb) {
    throw new Error(
      'Supabase not configured. Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.',
    );
  }
  return sb.schema('finx');
}

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}