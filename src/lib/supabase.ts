
import { createClient } from '@supabase/supabase-js';

// Load Supabase URL and Publishable (Anon) Key from environment variables.
// These are safe to expose in the browser and should match the 'sb_publishable_...' key in your dashboard.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Defensive check to prevent application crashes if environment variables are missing.
const isConfigValid = 
  supabaseUrl && 
  supabaseUrl !== 'undefined' && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'undefined' &&
  supabaseUrl.length > 0;

/**
 * Shared Supabase client for client-side storage operations.
 * Initialized with the Publishable (Anon) key to ensure security.
 * CRUD operations are controlled via Supabase RLS (Row Level Security) policies on your buckets.
 */
export const supabase = isConfigValid 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
