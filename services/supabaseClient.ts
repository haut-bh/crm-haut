
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mfgxtibcickbhifnmjmj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mZ3h0aWJjaWNrYmhpZm5tam1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MzAxNTUsImV4cCI6MjA4NTIwNjE1NX0.aJmBM3Hffwev1oi6AImfnZQMOuUK8SNoPLMhh_0s4-Q';

export const supabase = createClient(supabaseUrl, supabaseKey);
