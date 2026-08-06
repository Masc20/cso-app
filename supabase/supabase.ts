import { createClient } from '@supabase/supabase-js';
import type { ApplicationRecord } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-cso-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type CommitteeRegistration = ApplicationRecord;
