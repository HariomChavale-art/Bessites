
import { createClient } from '@supabase/supabase-js';

// Load Supabase URL and Publishable Key from environment variables.
// Trimming and cleaning the URL to ensure it is just the base domain.
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, ''); // Remove /rest/v1/ if user accidentally pasted it
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || '';

/**
 * Diagnostics helper to safely report missing configuration.
 * Returns boolean status for each variable without revealing values.
 */
export const getSupabaseConfigStatus = () => {
  return {
    hasUrl: !!supabaseUrl && supabaseUrl.length > 0 && supabaseUrl.startsWith('http'),
    hasKey: !!supabasePublishableKey && supabasePublishableKey.length > 0,
  };
};

/**
 * Shared Supabase client for client-side storage operations.
 */
const isConfigValid = !!supabaseUrl && !!supabasePublishableKey && supabaseUrl.startsWith('http');

if (!isConfigValid) {
  console.warn("[Bessites] Supabase configuration is incomplete. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
}

export const supabase = isConfigValid 
  ? createClient(supabaseUrl, supabasePublishableKey) 
  : null;
