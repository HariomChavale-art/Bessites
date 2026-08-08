import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Support both standard naming conventions
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

// Defensive check to prevent module-level crash if environment variables are missing or set to "undefined" string
const isValidConfig = supabaseUrl && supabaseUrl !== 'undefined' && supabaseKey && supabaseKey !== 'undefined' && supabaseUrl.length > 0;

/**
 * Supabase client for client-side storage operations.
 * Uses the publishable/anon key as requested.
 */
export const supabase = isValidConfig 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;
