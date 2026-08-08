import { createClient } from '@supabase/supabase-js';

// Load Supabase URL and Publishable (Anon) Key from environment variables.
// Standardized Next.js prefix for client-side visibility.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Diagnostics helper to safely report missing configuration.
 * Returns boolean status for each variable without revealing values.
 */
export const getSupabaseConfigStatus = () => {
  return {
    hasUrl: !!supabaseUrl && supabaseUrl !== 'undefined' && supabaseUrl.length > 0,
    hasKey: !!supabasePublishableKey && supabasePublishableKey !== 'undefined' && supabasePublishableKey.length > 0,
  };
};

/**
 * Shared Supabase client for client-side storage operations.
 * Initialized with the Publishable (Anon) key to ensure security.
 */
const isConfigValid = 
  supabaseUrl && 
  supabaseUrl !== 'undefined' && 
  supabasePublishableKey && 
  supabasePublishableKey !== 'undefined' &&
  supabaseUrl.length > 0;

export const supabase = isConfigValid 
  ? createClient(supabaseUrl, supabasePublishableKey) 
  : null;
