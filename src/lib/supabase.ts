// src/lib/supabase.ts

import { createClient } from "@supabase/supabase-js";

// Use the environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This client handles anonymous auth for us automatically
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Stores the anonymous session in localStorage
  },
});
