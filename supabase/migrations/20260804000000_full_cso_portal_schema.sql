-- ====================================================================
-- SUPABASE MIGRATION: FULL CSO WEB PORTAL SCHEMA & SECURITY POLICIES
-- File: supabase/migrations/20260804000000_full_cso_portal_schema.sql
-- Description: Complete schema setup for Computer Studies Organization (CSO)
-- Includes: Tables, RLS Policies, Indexes, Triggers, and Auth Sync.
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. TABLE: public.cso_settings
-- Stores application key-value configurations (e.g. portal status gate)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cso_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.cso_settings ENABLE ROW LEVEL SECURITY;

-- Default Settings Seed: Portal Gate open by default
INSERT INTO public.cso_settings (key, value)
VALUES ('is_registration_open', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- RLS Policy 1a: Public read portal settings (so non-logged-in students can check portal gate status)
CREATE POLICY "Public read portal settings"
  ON public.cso_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policy 1b: Authenticated officers update portal settings
CREATE POLICY "Authenticated officers update portal settings"
  ON public.cso_settings
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL)
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- RLS Policy 1c: Authenticated officers insert portal settings
CREATE POLICY "Authenticated officers insert portal settings"
  ON public.cso_settings
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);


-- --------------------------------------------------------------------
-- 2. TABLE: public.committee_applications
-- Stores student recruitment applications submitted via the main web portal
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.committee_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  facebook_link TEXT NOT NULL,
  year_level TEXT NOT NULL,
  course_program TEXT NOT NULL,
  primary_committee TEXT NOT NULL,
  secondary_committee TEXT,
  portfolio_url TEXT,
  motivation_statement TEXT NOT NULL,
  application_status TEXT DEFAULT 'Pending' CHECK (
    application_status IN ('Pending', 'Approved', 'Rejected', 'Interview Scheduled')
  ),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast searching and filtering
CREATE INDEX IF NOT EXISTS idx_committee_apps_primary_committee ON public.committee_applications(primary_committee);
CREATE INDEX IF NOT EXISTS idx_committee_apps_status ON public.committee_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_committee_apps_created_at ON public.committee_applications(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.committee_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policy 2a: Strict Public Student Application Inserts
CREATE POLICY "Strict public registration inserts"
  ON public.committee_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(student_id) >= 3 AND
    char_length(first_name) >= 1 AND
    char_length(last_name) >= 1 AND
    primary_committee IS NOT NULL
  );

-- RLS Policy 2b: Authenticated Officers Select Applications
CREATE POLICY "Authenticated officers select applications"
  ON public.committee_applications
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);

-- RLS Policy 2c: Authenticated Officers Update Applications
CREATE POLICY "Authenticated officers update application status"
  ON public.committee_applications
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL)
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);


-- --------------------------------------------------------------------
-- 3. TABLE: public.officer_profiles
-- Stores CSO Officer profiles, system roles, and assigned committee access scopes
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.officer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'officer')),
  assigned_committee TEXT NOT NULL CHECK (
    assigned_committee IN ('All', 'G.A.D Committee', 'Gaming Committee', 'Networking Committee', 'Programming Committee')
  ),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.officer_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy 3a: Authenticated Officers Select Profiles
CREATE POLICY "Authenticated officers select all profiles"
  ON public.officer_profiles
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL);

-- RLS Policy 3b: Authenticated Officers Insert Profile
CREATE POLICY "Authenticated insert officer profile"
  ON public.officer_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) IS NOT NULL AND
    id IS NOT NULL AND
    char_length(email) > 3
  );

-- RLS Policy 3c: Authenticated Officers Update Profile
CREATE POLICY "Authenticated update officer profile"
  ON public.officer_profiles
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) IS NOT NULL)
  WITH CHECK (
    (SELECT auth.uid()) IS NOT NULL AND
    id IS NOT NULL
  );


-- --------------------------------------------------------------------
-- 4. AUTOMATED USER IMPORT FROM SUPABASE AUTH.USERS INTO OFFICER_PROFILES
-- Automatically imports existing Auth accounts into public.officer_profiles
-- --------------------------------------------------------------------
INSERT INTO public.officer_profiles (id, email, full_name, role, assigned_committee)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  CASE 
    WHEN email LIKE '%admin%' OR email LIKE '%cso%' THEN 'super_admin'
    ELSE 'officer'
  END, 
  CASE 
    WHEN email LIKE '%gaming%' THEN 'Gaming Committee'
    WHEN email LIKE '%gad%' OR email LIKE '%graphics%' THEN 'G.A.D Committee'
    WHEN email LIKE '%networking%' THEN 'Networking Committee'
    WHEN email LIKE '%programming%' THEN 'Programming Committee'
    ELSE 'All'
  END
FROM auth.users
ON CONFLICT (id) DO NOTHING;
