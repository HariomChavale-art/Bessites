
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Defensive check to prevent module-level crash if environment variables are missing or set to "undefined" string
const isValidConfig = supabaseUrl && supabaseUrl !== 'undefined' && supabaseKey && supabaseKey !== 'undefined';

export const supabase = isValidConfig 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;
