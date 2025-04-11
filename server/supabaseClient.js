const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://oahebjjqmnvpjxkoqnix.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9haGViampxbW52cGp4a29xbml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMjYyMDEsImV4cCI6MjA1OTkwMjIwMX0.Mt0vMC9_prj6ym1jKvCTf3Q3FR4__ibOlHVpnx0DWHI';
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };