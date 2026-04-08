import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = 'https://mfgxtibcickbhifnmjmj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mZ3h0aWJjaWNrYmhpZm5tam1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MzAxNTUsImV4cCI6MjA4NTIwNjE1NX0.aJmBM3Hffwev1oi6AImfnZQMOuUK8SNoPLMhh_0s4-Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  let log = "";

  log += "\nChecking 'lead_notes' table with select('*')...\n";
  const { data: noteData, error: noteError } = await supabase.from('lead_notes').select('*').limit(1);
  if (noteError) {
    log += `Error fetching from lead_notes: ${JSON.stringify(noteError)}\n`;
  } else {
    log += `Success! Fetched from lead_notes. Found ${noteData.length} records.\n`;
  }

  fs.writeFileSync('output.log', log);
}

check();
