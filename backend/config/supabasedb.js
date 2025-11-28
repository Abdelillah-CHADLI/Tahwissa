import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

export const supabase = createClient(
"https://trbivupdngzmwpofgmrg.supabase.co",
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyYml2dXBkbmd6bXdwb2ZnbXJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk0MTEwNSwiZXhwIjoyMDc5NTE3MTA1fQ.DScpYgTyvifEQMjJerBhplBAVTiPXyRDxsEFcWeQG0w"
);

export default supabase