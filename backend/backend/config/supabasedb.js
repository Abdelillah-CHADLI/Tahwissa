import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

export const supabase = createClient(
SUPABASE_URL,
SUPABASE_SERVICE_KEY
);

export default supabase