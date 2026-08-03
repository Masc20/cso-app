import { supabase } from '@/lib/supabase';
import type { ApplicationRecord, OfficerProfile } from '@/types';

export type { ApplicationRecord, OfficerProfile };

export async function fetchApplications(assignedCommittee: string = 'All'): Promise<ApplicationRecord[]> {
  try {
    let query = supabase
      .from('committee_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (assignedCommittee && assignedCommittee !== 'All') {
      if (assignedCommittee.includes('G.A.D')) {
        query = query.in('primary_committee', ['G.A.D Committee']);
      } else {
        query = query.eq('primary_committee', assignedCommittee);
      }
    }

    const { data, error } = await query;

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
    return false;
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

export async function fetchOfficerProfiles(): Promise<OfficerProfile[]> {
  try {
    const { data, error } = await supabase
      .from('officer_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data as OfficerProfile[];
    }
    if (error) {
      console.warn('Officer profiles fetch query note:', error.message);
    }
  } catch (err) {
    console.warn('Supabase officer profiles fetch exception:', err);
  }
  return [];
}

export async function updateOfficerProfile(
  id: string,
  role: 'super_admin' | 'officer',
  assigned_committee: OfficerProfile['assigned_committee']
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('officer_profiles')
      .update({ role, assigned_committee })
      .eq('id', id)
      .select();

    if (error) {
      console.warn('Supabase update officer profile error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase officer profile update exception:', err);
    return false;
  }
}
