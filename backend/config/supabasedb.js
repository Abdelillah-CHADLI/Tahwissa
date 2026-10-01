import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables.');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export default supabase;