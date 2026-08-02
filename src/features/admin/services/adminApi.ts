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

/**
 * Helper to update an application record in local storage cache
 */
function updateLocalApplicationRecord(id: string, updates: Partial<ApplicationRecord>): void {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem('cso_local_applications');
    if (stored) {
      const existing: ApplicationRecord[] = JSON.parse(stored);
      const updated = existing.map(a => a.id === id ? { ...a, ...updates } : a);
      localStorage.setItem('cso_local_applications', JSON.stringify(updated));
    }
  } catch (e) {
    console.warn('Error updating local application cache:', e);
  }
}

export async function fetchApplications(): Promise<ApplicationRecord[]> {
  let dbApps: ApplicationRecord[] = [];
  let localApps: ApplicationRecord[] = [];

  // 1. Query Real Supabase Database Table
  try {
    const { data, error } = await supabase
      .from('committee_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch note:', error.message);
    } else if (data && data.length > 0) {
      dbApps = data.map(item => ({
        ...item,
        application_status: item.application_status || 'Pending'
      }));
    }
  } catch (err) {
    console.warn('Supabase applications fetch exception:', err);
  }

  // 2. Fetch from LocalStorage cache as fallback/supplement
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('cso_local_applications');
      if (stored) {
        localApps = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading local applications cache:', e);
    }
  }

  const combinedMap = new Map<string, ApplicationRecord>();
  localApps.forEach(app => combinedMap.set(app.id || app.student_id, app));
  dbApps.forEach(app => combinedMap.set(app.id, app));

  return Array.from(combinedMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function updateApplicationStatus(id: string, status: string): Promise<boolean> {
  updateLocalApplicationRecord(id, { application_status: status });

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
  updateLocalApplicationRecord(id, { admin_notes: notes });

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

// -------------------------------------------------------------
// Dual-Layer Persistence: Supabase Database + LocalStorage Cache for Settings
// -------------------------------------------------------------

export async function fetchRegistrationStatus(): Promise<boolean> {
  let cachedStatus: boolean | null = null;

  try {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('cso_is_registration_open');
      if (cached !== null) {
        cachedStatus = cached === 'true';
      }
    }

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
    if (typeof window !== 'undefined') {
      localStorage.setItem('cso_is_registration_open', String(isOpen));
    }

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
    console.warn('Failed to toggle registration status:', err);
    return true;
  }
}
