import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL i klucz muszą być zdefiniowane w zmiennych środowiskowych!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);