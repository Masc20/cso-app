import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-cso-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CommitteeRegistration {
  id?: string;
  student_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  facebook_link: string;
  year_level: string;
  course_program: string;
  primary_committee: 'G.A.D' | 'Gaming Committee' | 'Networking Committee' | 'Programming Committee';
  secondary_committee?: string;
  portfolio_url?: string;
  motivation_statement: string;
  status?: string;
  created_at?: string;
}
