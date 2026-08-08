
import { createClient } from '@supabase/supabase-js';

/**
 * @fileOverview Supabase Client Initialization.
 * Robust configuration to handle various environment variable naming conventions.
 */

// Priority 1: Use the keys we just set in .env
// Priority 2: Use common fallback names
const supabaseUrl = (
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  'https://lysgdjmjtsjuoodnrncf.supabase.co'
).trim().replace(/\/rest\/v1\/?$/, '');

const supabasePublishableKey = (
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_3ugGpWCrIe47FFR5GA53Ew_VoL7BPiL'
).trim();

/**
 * Diagnostics helper to safely report missing configuration.
 * Returns boolean status for each variable without revealing values.
 */
export const getSupabaseConfigStatus = () => {
  const hasUrl = !!supabaseUrl && supabaseUrl.length > 10 && supabaseUrl.startsWith('http');
  const hasKey = !!supabasePublishableKey && supabasePublishableKey.startsWith('sb_');
  
  return {
    hasUrl,
    hasKey,
    isConfigured: hasUrl && hasKey
  };
};

/**
 * Shared Supabase client for client-side storage operations.
 */
const status = getSupabaseConfigStatus();

if (!status.isConfigured) {
  console.error("[Bessites] Critical: Supabase configuration is missing or invalid.", status);
} else {
  console.log("[Bessites] Supabase module initialized successfully.");
}

// Ensure we only create the client if we have valid-looking strings
export const supabase = status.isConfigured 
  ? createClient(supabaseUrl, supabasePublishableKey) 
  : null;
