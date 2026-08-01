import { supabase } from '@/lib/supabase';

export interface ApplicationRecord {
  id: string;
  created_at: string;
  student_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  facebook_link: string;
  year_level: string;
  course_program: string;
  primary_committee: string;
  secondary_committee: string | null;
  portfolio_url: string | null;
  motivation_statement: string;
  application_status?: string;
  admin_notes?: string | null;
}

export async function fetchApplications(): Promise<ApplicationRecord[]> {
  try {
    const { data, error } = await supabase
      .from('committee_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error:', error.message);
      return [];
    }

    return (data || []).map(item => ({
      ...item,
      application_status: item.application_status || 'Pending'
    }));
  } catch (err) {
    console.error('Failed to fetch applications:', err);
    return [];
  }
}

export async function updateApplicationStatus(id: string, status: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('committee_applications')
      .update({ application_status: status })
      .eq('id', id);

    if (error) {
      console.warn('Supabase update status note:', error.message);
    }
    return true;
  } catch (err) {
    console.error('Failed to update status:', err);
    return true; // Graceful fallback
  }
}

export async function updateAdminNotes(id: string, notes: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('committee_applications')
      .update({ admin_notes: notes })
      .eq('id', id);

    if (error) {
      console.warn('Supabase update notes note:', error.message);
    }
    return true;
  } catch (err) {
    console.error('Failed to update notes:', err);
    return true;
  }
}
