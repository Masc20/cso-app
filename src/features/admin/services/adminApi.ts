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
  portfolioUrl?: string | null;
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

    if (!error && data && data.length > 0) {
      return data.map(item => ({
        ...item,
        application_status: item.application_status || 'Pending'
      }));
    }

    if (error) {
      console.warn('Supabase fetch query note:', error.message);
    }
  } catch (err) {
    console.warn('Supabase applications fetch exception:', err);
  }

  return [];
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
  } catch (err) {
    console.warn('Supabase status update note:', err);
  }

  return true;
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
  } catch (err) {
    console.warn('Supabase notes update note:', err);
  }

  return true;
}

export async function fetchRegistrationStatus(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('cso_settings')
      .select('value')
      .eq('key', 'is_registration_open')
      .single();

    if (error || !data) {
      return false;
    }

    if (typeof data.value === 'boolean') return data.value;
    if (typeof data.value === 'string') return data.value === 'true';
    return Boolean(data.value);
  } catch (err) {
    return true;
  }
}

export async function toggleRegistrationStatus(isOpen: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cso_settings')
      .upsert(
        { 
          key: 'is_registration_open', 
          value: isOpen, 
          updated_at: new Date().toISOString() 
        },
        { onConflict: 'key' }
      );

    if (error) {
      console.warn('Supabase toggle registration error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to toggle registration status in Supabase:', err);
    return false;
  }
}
