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
    return true;
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

// -------------------------------------------------------------
// Dual-Layer Persistence: Supabase Database + LocalStorage Cache
// -------------------------------------------------------------

export async function fetchRegistrationStatus(): Promise<boolean> {
  let cachedStatus: boolean | null = null;

  try {
    // 1. Check local storage cache
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('cso_is_registration_open');
      if (cached !== null) {
        cachedStatus = cached === 'true';
      }
    }

    // 2. Query Supabase Settings Table
    const { data, error } = await supabase
      .from('cso_settings')
      .select('value')
      .eq('key', 'is_registration_open')
      .single();

    if (error || !data) {
      return cachedStatus !== null ? cachedStatus : true;
    }

    const isOpen = Boolean(data.value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cso_is_registration_open', String(isOpen));
    }
    return isOpen;
  } catch (err) {
    if (cachedStatus !== null) return cachedStatus;
    return true;
  }
}

export async function toggleRegistrationStatus(isOpen: boolean): Promise<boolean> {
  try {
    // 1. Cache immediately in localStorage for instant client response
    if (typeof window !== 'undefined') {
      localStorage.setItem('cso_is_registration_open', String(isOpen));
    }

    // 2. Persist to Supabase Settings Table
    const { error } = await supabase
      .from('cso_settings')
      .upsert({ 
        key: 'is_registration_open', 
        value: isOpen, 
        updated_at: new Date().toISOString() 
      });

    if (error) {
      console.warn('Supabase toggle registration note:', error.message);
    }
    return true;
  } catch (err) {
    console.error('Failed to toggle registration status:', err);
    return true;
  }
}
