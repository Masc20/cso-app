-- 1. Create Dynamic Committee Registry Table
CREATE TABLE IF NOT EXISTS public.cso_committees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    short_name TEXT NOT NULL,
    description TEXT NOT NULL,
    logo TEXT DEFAULT '/cso-logo.png',
    accent_color TEXT DEFAULT 'from-amber-500 to-amber-600',
    border_glow TEXT DEFAULT 'hover:border-amber-500/50',
    badge_bg TEXT DEFAULT 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    tags TEXT[] DEFAULT '{}',
    video_url TEXT,
    video_title TEXT,
    video_poster TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.cso_committees ENABLE ROW LEVEL SECURITY;

-- 3. RLS Security Policies
CREATE POLICY "Allow public read access to active committees"
ON public.cso_committees FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Allow authenticated admins to insert committees"
ON public.cso_committees FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated admins to update committees"
ON public.cso_committees FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated admins to delete committees"
ON public.cso_committees FOR DELETE TO authenticated
USING (auth.uid() IS NOT NULL);

-- 4. Initial Seed Data (Default 4 Committees)
INSERT INTO public.cso_committees (name, short_name, description, logo, accent_color, border_glow, badge_bg, tags)
VALUES 
(
    'G.A.D Committee', 
    'G.A.D', 
    'Spearheading visual identity, UI/UX prototyping, event posters, motion graphics, and media branding.',
    '/imgs/gad-logo.png',
    'from-amber-500 to-amber-600',
    'hover:border-amber-500/50',
    'bg-amber-500/10 text-amber-500 border-amber-500/30',
    ARRAY['UI/UX Design', 'Photoshop & Figma', 'Branding']
),
(
    'Gaming Committee', 
    'Gaming', 
    'Organizing esports tournaments, game development workshops, shoutcasting, and campus gaming events.',
    '/imgs/gaming-logo.png',
    'from-emerald-500 to-emerald-600',
    'hover:border-emerald-500/50',
    'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    ARRAY['Esports', 'GameDev', 'Tournaments']
),
(
    'Networking Committee', 
    'Networking', 
    'Managing event network infrastructure, server management, cybersecurity, IoT setups, and hardware.',
    '/imgs/networking-logo.png',
    'from-sky-500 to-sky-600',
    'hover:border-sky-500/50',
    'bg-sky-500/10 text-sky-500 border-sky-500/30',
    ARRAY['SysAdmin', 'LAN & Wi-Fi Setup', 'Cybersecurity']
),
(
    'Programming Committee', 
    'Programming', 
    'Leading web & mobile development, competitive coding, hackathons, API integrations, and code reviews.',
    '/imgs/programming-logo.png',
    'from-fuchsia-500 to-fuchsia-600',
    'hover:border-fuchsia-500/50',
    'bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/30',
    ARRAY['Web & Mobile', 'Competitive Coding', 'Hackathons']
)
ON CONFLICT (name) DO NOTHING;
