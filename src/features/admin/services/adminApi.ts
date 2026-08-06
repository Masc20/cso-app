import { supabase } from '@/lib/supabase';
import type { ApplicationRecord, OfficerProfile, Committee } from '@/types';

export const DEFAULT_COMMITTEES: Committee[] = [
  {
    id: 'G.A.D Committee', name: 'G.A.D Committee', shortName: 'G.A.D',
    description: 'Spearheading visual identity, UI/UX prototyping, event posters, motion graphics, and media branding.',
    logo: '/imgs/Committees/GAD/Logo.png', accentColor: 'from-[#f59e0b] via-[#ec4899] to-[#10b981]',
    borderGlow: 'hover:shadow-amber-500/40 border-amber-500/60 dark:border-amber-400/50',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    tags: ['UI/UX Design', 'Photoshop & Figma', 'Branding'],
    videoUrl: 'GAD%20Committee.mp4',
    videoTitle: 'G.A.D Committee 2025-2026',
    is_active: true
  },
  {
    id: 'Gaming Committee', name: 'Gaming Committee', shortName: 'Gaming',
    description: 'Organizing esports tournaments, game development workshops, shoutcasting, and campus gaming events.',
    logo: '/imgs/Committees/Gaming/Logo.png', accentColor: 'from-[#10b981] to-[#059669]',
    borderGlow: 'hover:shadow-emerald-500/40 border-emerald-500/60 dark:border-emerald-400/50',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    tags: ['Esports Ops', 'Tournament Hosting', 'Game Dev'],
    is_active: true
  },
  {
    id: 'Networking Committee', name: 'Networking Committee', shortName: 'Networking',
    description: 'Managing event network infrastructure, server management, cybersecurity, IoT setups, and hardware.',
    logo: '/imgs/Committees/Networking/Logo.png', accentColor: 'from-[#0ea5e9] to-[#0284c7]',
    borderGlow: 'hover:shadow-sky-500/40 border-sky-500/60 dark:border-sky-400/50',
    badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
    tags: ['SysAdmin', 'LAN & Wi-Fi Setup', 'Cybersecurity'],
    videoUrl: 'Networking%20Committee.mp4',
    videoTitle: 'Networking Committee 2025-2026',
    is_active: true
  },
  {
    id: 'Programming Committee', name: 'Programming Committee', shortName: 'Programming',
    description: 'Leading web & mobile development, competitive coding, hackathons, API integrations, and code reviews.',
    logo: '/imgs/Committees/Programming/Logo.png', accentColor: 'from-[#d946ef] to-[#c026d3]',
    borderGlow: 'hover:shadow-fuchsia-500/40 border-fuchsia-500/60 dark:border-fuchsia-400/50',
    badgeBg: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/30',
    tags: ['Web & Mobile', 'Competitive Coding', 'Hackathons'],
    is_active: true
  },
];

/**
 * Fetch applications filtered by committee assignment scope
 */
export async function fetchApplications(assignedCommittee: string = 'All'): Promise<ApplicationRecord[]> {
  try {
    let query = supabase
      .from('committee_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (assignedCommittee !== 'All') {
      query = query.eq('primary_committee', assignedCommittee);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase fetch applications error:', error.message);
      return [];
    }

    return (data as ApplicationRecord[]) || [];
  } catch (err) {
    console.warn('Failed to fetch applications:', err);
    return [];
  }
}

/**
 * Update Application Status
 */
export async function updateApplicationStatus(id: string, status: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('committee_applications')
      .update({ application_status: status })
      .eq('id', id);

    if (error) {
      console.warn('Error updating application status:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('Failed to update application status:', err);
    return false;
  }
}

/**
 * Update Admin Notes for an Application
 */
export async function updateAdminNotes(id: string, notes: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('committee_applications')
      .update({ admin_notes: notes })
      .eq('id', id);

    if (error) {
      console.warn('Error updating admin notes:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('Failed to update admin notes:', err);
    return false;
  }
}

/**
 * Fetch Registration Portal Gate Status
 */
export async function fetchRegistrationStatus(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('cso_settings')
      .select('value')
      .eq('key', 'is_registration_open')
      .single();

    if (error || !data) return true; // Default open
    return data.value === 'true' || data.value === true;
  } catch (err) {
    console.warn('Failed to fetch registration status:', err);
    return true;
  }
}

/**
 * Toggle Registration Portal Gate Status
 */
export async function toggleRegistrationStatus(isOpen: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cso_settings')
      .upsert({
        key: 'is_registration_open',
        value: String(isOpen),
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) {
      console.warn('Error toggling registration status:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('Failed to toggle registration status:', err);
    return false;
  }
}

/**
 * Fetch Officer Profiles
 */
export async function fetchOfficerProfiles(): Promise<OfficerProfile[]> {
  try {
    const { data, error } = await supabase
      .from('officer_profiles')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) {
      console.warn('Error fetching officer profiles:', error.message);
      return [];
    }

    return (data as OfficerProfile[]) || [];
  } catch (err) {
    console.warn('Failed to fetch officer profiles:', err);
    return [];
  }
}

/**
 * Update Officer Profile (Role & Committee Scope)
 */
export async function updateOfficerProfile(
  id: string,
  role: 'super_admin' | 'officer',
  committee: OfficerProfile['assigned_committee']
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('officer_profiles')
      .update({ role, assigned_committee: committee })
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

/* ====================================================================
 * DYNAMIC COMMITTEE CRUD SERVICES (CONNECTED DIRECTLY TO SUPABASE)
 * ==================================================================== */

/**
 * Fetch All Committees (Active & Inactive for Admin, Active Only for Public)
 */
export async function fetchCommittees(includeInactive: boolean = false): Promise<Committee[]> {
  try {
    let query = supabase.from('cso_committees').select('*').order('name', { ascending: true });

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Fallback to default committees registry if table doesn't exist or is empty
      return includeInactive ? DEFAULT_COMMITTEES : DEFAULT_COMMITTEES.filter(c => c.is_active !== false);
    }

    // Map database snake_case to Committee interface & merge defaults
    const databaseCommittees: Committee[] = data.map((item: any) => {
      const fallback = DEFAULT_COMMITTEES.find(c => 
        c.name.toLowerCase() === item.name?.toLowerCase() || 
        c.shortName?.toLowerCase() === item.short_name?.toLowerCase() ||
        c.id?.toLowerCase() === item.id?.toLowerCase()
      );

      let parsedTags: string[] = [];
      if (Array.isArray(item.tags)) {
        parsedTags = item.tags;
      } else if (typeof item.tags === 'string' && item.tags.startsWith('[')) {
        try { parsedTags = JSON.parse(item.tags); } catch (e) { parsedTags = []; }
      }

      return {
        id: item.id || fallback?.id || item.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: item.name || fallback?.name || 'Committee',
        shortName: item.short_name || item.shortName || fallback?.shortName || item.name?.split(' ')[0] || 'Comm',
        short_name: item.short_name || fallback?.shortName,
        description: item.description || fallback?.description || 'Committee overview and activities.',
        logo: item.logo && item.logo !== '/cso-logo.png' ? item.logo : (fallback?.logo || '/imgs/CSOLOGO.png'),
        accentColor: item.accent_color || item.accentColor || fallback?.accentColor || 'from-amber-500 to-amber-600',
        borderGlow: item.border_glow || item.borderGlow || fallback?.borderGlow || 'hover:border-amber-500/50',
        badgeBg: item.badge_bg || item.badgeBg || fallback?.badgeBg || 'bg-amber-500/10 text-amber-500 border-amber-500/30',
        Icon: fallback?.Icon,
        iconClassName: fallback?.iconClassName,
        tags: parsedTags.length > 0 ? parsedTags : (fallback?.tags || ['CSO', 'Division']),
        videoUrl: item.video_url || item.videoUrl || fallback?.videoUrl,
        video_url: item.video_url || fallback?.videoUrl,
        videoPoster: item.video_poster || item.videoPoster || fallback?.videoPoster,
        video_poster: item.video_poster || fallback?.videoPoster,
        videoTitle: item.video_title || item.videoTitle || fallback?.videoTitle,
        video_title: item.video_title || fallback?.videoTitle,
        is_active: item.is_active !== false,
        created_at: item.created_at
      };
    });

    // Ensure default committees are included if missing in database
    const mergedList = [...databaseCommittees];
    DEFAULT_COMMITTEES.forEach(defaultComm => {
      const exists = mergedList.some(c => 
        c.name.toLowerCase() === defaultComm.name.toLowerCase() ||
        c.shortName.toLowerCase() === defaultComm.shortName.toLowerCase()
      );
      if (!exists && includeInactive) {
        mergedList.push(defaultComm);
      }
    });

    return mergedList;
  } catch (err) {
    console.warn('Failed to fetch committee registry from database, using fallback:', err);
    return DEFAULT_COMMITTEES;
  }
}

/**
 * Save Committee (Create or Update)
 */
export async function saveCommittee(committee: Partial<Committee>): Promise<boolean> {
  try {
    const payload = {
      name: committee.name,
      short_name: committee.shortName || committee.short_name,
      description: committee.description,
      logo: committee.logo,
      accent_color: committee.accentColor || '#f59e0b',
      tags: committee.tags || [],
      video_url: committee.videoUrl || committee.video_url || null,
      video_title: committee.videoTitle || committee.video_title || null,
      video_poster: committee.videoPoster || committee.video_poster || null,
      is_active: committee.is_active !== false,
      updated_at: new Date().toISOString()
    };

    if (committee.id && !committee.id.startsWith('new-')) {
      const { error } = await supabase
        .from('cso_committees')
        .update(payload)
        .eq('id', committee.id);

      if (error) {
        console.warn('Error updating committee:', error.message);
        return false;
      }
    } else {
      const { error } = await supabase
        .from('cso_committees')
        .insert([payload]);

      if (error) {
        console.warn('Error creating committee:', error.message);
        return false;
      }
    }

    return true;
  } catch (err) {
    console.warn('Failed to save committee record:', err);
    return false;
  }
}

/**
 * Toggle Committee Active Status (Soft Delete / Archive)
 */
export async function toggleCommitteeActive(id: string, isActive: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cso_committees')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.warn('Error toggling committee active status:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('Failed to toggle committee active status:', err);
    return false;
  }
}

/**
 * Delete Committee Record
 */
export async function deleteCommittee(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cso_committees')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Error deleting committee:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('Failed to delete committee:', err);
    return false;
  }
}
