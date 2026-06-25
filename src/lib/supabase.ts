
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lysgdjmjtsjuoodnrncf.supabase.co';
const supabaseKey = 'sb_publishable_3ugGpWCrIe47FFR5GA53Ew_VoL7BPiL';

export const supabase = createClient(supabaseUrl, supabaseKey);
