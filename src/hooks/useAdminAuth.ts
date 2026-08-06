'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/supabase';
import { User } from '@supabase/supabase-js';
import type { OfficerProfile } from '@/types';

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<OfficerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch officer profile details from user_metadata, officer_profiles table, or email rules
  const fetchProfile = async (authUser: User) => {
    const email = (authUser.email || '').toLowerCase();
    const meta = authUser.user_metadata || {};

    if (meta.role || meta.assigned_committee) {
      setProfile({
        id: authUser.id,
        email: authUser.email || '',
        full_name: meta.full_name || authUser.email?.split('@')[0] || 'CSO Officer',
        role: meta.role === 'officer' ? 'officer' : 'super_admin',
        assigned_committee: (meta.assigned_committee as OfficerProfile['assigned_committee']) || 'All'
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('officer_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (!error && data) {
        setProfile(data as OfficerProfile);
        return;
      }
    } catch (err) {
      console.warn('Officer profile DB query note:', err);
    }

    let role: 'super_admin' | 'officer' = 'officer';
    let assigned_committee: OfficerProfile['assigned_committee'] = 'All';

    if (email.includes('super') || email.includes('admin@') || email.includes('cso_admin') || email.includes('head')) {
      role = 'super_admin';
      assigned_committee = 'All';
    } else if (email.includes('gad') || email.includes('graphics') || email.includes('design')) {
      role = 'officer';
      assigned_committee = 'G.A.D Committee';
    } else if (email.includes('gaming') || email.includes('esports') || email.includes('game')) {
      role = 'officer';
      assigned_committee = 'Gaming Committee';
    } else if (email.includes('network') || email.includes('cisco') || email.includes('net')) {
      role = 'officer';
      assigned_committee = 'Networking Committee';
    } else if (email.includes('programming') || email.includes('dev') || email.includes('code')) {
      role = 'officer';
      assigned_committee = 'Programming Committee';
    }

    setProfile({
      id: authUser.id,
      email: authUser.email || '',
      full_name: meta.full_name || authUser.email?.split('@')[0] || 'CSO Officer',
      role,
      assigned_committee
    });
  };

  useEffect(() => {
    // 1. Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.warn('Auth session check note:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out note:', err);
    }
    setUser(null);
    setProfile(null);
  };

  return {
    user,
    profile,
    loading,
    logout,
    isAuthenticated: !!user
  };
}
