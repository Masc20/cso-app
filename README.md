# Computer Studies Organization (CSO) Web Portal

## ACLC College of Mandaue City

An official web application, committee registration portal, and executive command center for the **Computer Studies Organization (CSO)** at ACLC College of Mandaue.

---

## Technology Stack

- **Framework**: Next.js 16+ (App Router, Turbopack, React 19)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 with custom dark/light mode semantic tokens (`.bg-cso-page`, `.bg-cso-card`, `.bg-cso-input`, `.border-cso`)
- **Database & Storage**: Supabase PostgreSQL, Supabase Storage (`cso-videos` bucket), Row Level Security (RLS)
- **Icons & Visual Effects**: Lucide React, Canvas Confetti
- **Deployment Target**: Vercel

---

## Codebase Architecture

The project strictly adheres to a **Feature-Driven Modular Architecture**:

```text
src/
├── app/                        # Next.js 16+ App Router Routes & API Endpoints
│   ├── admin/
│   │   ├── dashboard/page.tsx  # Executive Command Center & Scoped Applicant Management
│   │   └── login/page.tsx       # Officer Login Gateway
│   ├── api/
│   │   ├── admin/login/route.ts # Server In-Memory Rate Limiter & Auth Proxy
│   │   └── register/route.ts    # Student Registration Rate Limiter Engine
│   ├── globals.css             # Tailwind CSS v4, theme variables & ribbon shape polygon
│   ├── layout.tsx              # Root Layout, Plus Jakarta Sans & JetBrains Mono Fonts + ToastProvider
│   └── page.tsx                # Main Landing Page Assembly
│
├── components/                 # Shared UI & Layout Primitives
│   ├── index.ts                # Master Components Barrel Export
│   ├── layout/
│   │   ├── AdminSidebar.tsx    # Multi-Tab Officer Navigation & Profile Summary
│   │   ├── Footer.tsx          # Campus Info & Dynamic Committee Links
│   │   ├── HeroCSO.tsx         # Title Typography Banner
│   │   └── Navbar.tsx          # Dynamic Glassmorphic Blur Header
│   ├── modals/
│   │   ├── ApplicationDetailModal.tsx # Applicant Detail Evaluation Modal
│   │   ├── CommitteeVideoModal.tsx    # Committee Intro Video Player Modal
│   │   ├── ConfirmModal.tsx           # Custom Backdrop Danger/Warning Confirm Primitive
│   │   ├── EditCommitteeModal.tsx     # Committee & Video Showcase Management Modal
│   │   ├── EditOfficerModal.tsx       # Officer Scope & Role Management Modal
│   │   ├── Modal.tsx                  # Accessible Backdrop Primitive
│   │   └── index.ts                   # Modals Barrel Export
│   └── ui/
│       ├── FloatingInput.tsx   # Floating-label Input with Tooltips
│       ├── FloatingSelect.tsx  # Floating-label Select Dropdown
│       ├── FloatingTextarea.tsx# Floating-label Textarea with Tooltips
│       ├── Table.tsx           # Sticky Header Table & TablePagination Primitive
│       ├── Toast.tsx           # Reusable Toast Notification Item
│       └── index.ts            # UI Primitives Barrel Export
│
├── context/                    # Global React Context Providers
│   └── ToastContext.tsx        # Non-overlapping Vertical Stacked Toast Provider
│
├── data/                       # Centralized Static Registries & Data Constants
│   ├── index.ts                # Master Data Barrel Export
│   ├── committees.ts           # Fallback Committee Metadata & Videos Config
│   ├── mediaGallery.ts         # Showcase Media Items
│   ├── navigation.ts           # Nav Links & Official Facebook Links
│   └── options.ts              # Course, Year Level, Status, & Officer Role Options
│
├── features/                   # Feature-Driven Modular Domain Engines
│   ├── index.ts                # Master Features Barrel Export
│   ├── admin/                  # Executive Admin Portal Domain
│   │   ├── components/         # AdminDashboardOverview, ApplicationsTable, OfficerManagementTable, CommitteeManagementTable
│   │   ├── services/adminApi.ts# Dynamic Supabase Committee & Application Queries
│   │   └── index.ts            # Admin Feature Barrel Export
│   ├── committees/             # Committee Ribbons Domain
│   │   ├── components/         # CommitteeRibbons (with RibbonSkeleton loading)
│   │   └── index.ts
│   ├── gallery/                # Media Showcase Domain
│   └── registration/           # Student Registration Domain
│       ├── RegistrationPortal.tsx # Registration Form, Deduplication & Confetti
│       └── index.ts
│
├── hooks/                      # Custom React Hooks
│   ├── index.ts                # Hooks Barrel Export
│   ├── useAdminAuth.ts         # Multi-Tier Profile & Auth Hook
│   ├── useDarkMode.ts          # Instant Dark Mode Manager
│   ├── useModalState.ts        # Centralized Modal Open/Close Manager
│   └── useToast.ts             # Global Toast Trigger Hook
│
├── lib/                        # Infrastructure, Services & Helper Utilities
│   ├── serverRateLimit.ts      # Server IP Rate Limiter Engine
│   ├── supabase/               # Typed Supabase Client
│   └── utils/
│       ├── index.ts            # Master Utils Barrel Export
│       ├── analyticsHelpers.ts # Demand Breakdown & Top Choice Calculators
│       ├── exportHelpers.ts    # CSV Browser Export Engine
│       ├── formatting.ts       # Status Badges & Brand Color Utility Resolvers
│       ├── skeleton.tsx        # Polygon Geometry Ribbon Skeleton Loading Cards
│       └── validation.ts       # XSS Sanitizer & URL Validators
│
└── types/
    └── index.ts                # Global Domain Entities & Component Contracts
```

---

## Key Capabilities & System Features

1. **Centralized Primitive `<Table>` & `<TablePagination>` System**:
   - Sticky top headers (`sticky top-0 z-20 bg-[#f4f4f2] dark:bg-[#121215]`), max-height scroll containers (`max-h-[65vh]`), and dynamic pagination controls (`5`, `10`, `25`, `50` rows per page with first/last page guards).

2. **Global Non-Overlapping Toast System (`ToastProvider`)**:
   - Managed globally via `useToast()` hook. Toasts render in a non-overlapping vertical flex column stack (`flex flex-col-reverse gap-2.5 items-end`).
   - Independent 3.5-second auto-dismiss timers per toast and dynamic light/dark theme adaptation.

3. **Multi-Tier Officer Role-Based Access Control (RBAC)**:
   - **Super Admin**: Full access to global analytics, officer role editing (`super_admin` vs `officer`), committee scope assignment, committee deletion, and recruitment gate toggling.
   - **Committee Officer**: Hard-locked view to their assigned committee applicants (e.g. `G.A.D Committee`, `Gaming Committee`, `Networking Committee`, `Programming Committee`) with scope lock indicators (`Scope Locked`).

4. **Dynamic Supabase Committee & Video Showcase Manager**:
   - Live synchronization with Supabase `cso_committees` table.
   - Integrated MP4 video showcase upload directly to Supabase Storage (`cso-videos` bucket) or external YouTube/embed link support.

5. **Signature Committee Brand Color System**:
   - Dynamic brand badge highlights, dropdown options, and card hover ambient glows:
     - 🟡 **G.A.D**: Warm Amber
     - 🟢 **Gaming**: Esports Emerald Green
     - 🔵 **Networking**: Cyber Sky Blue
     - 🟣 **Programming**: Neon Fuchsia Purple

6. **Native Geometry Polygon Skeleton Loading**:
   - `RibbonSkeleton` matches the exact downwards polygon clip-path (`.ribbon-clip`) and circular logo outline during async Supabase data fetching.

7. **Custom `<ConfirmModal>` Primitive**:
   - Replaces browser `alert()` and `confirm()` dialogs with styled, backdrop-blurred confirmation modals.

8. **Security & Rate Limiting Engine**:
   - Protects against brute-force attacks with a 5-attempt / 15-minute IP lock on admin login and 10-attempt / 30-second cooldown on registration submissions.

---

## Getting Started

### 1. Prerequisites

- **Node.js**: `18.x` or higher
- **Package Manager**: `npm`

### 2. Installation & Setup

Clone the repository and install dependencies:

```bash
cd cso-app
npm install
```

### 3. Environment Variables

Create a `.env.local` file inside the `cso-app` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the web portal.  
Access the Admin Portal at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## Full Supabase Database Migration & RLS Setup

A production migration script is available at `supabase/migrations/20260804000000_full_cso_portal_schema.sql`.

Copy and execute the following SQL script in your **Supabase SQL Editor**:

```sql
-- 1. Create Committee Applications Table
CREATE TABLE IF NOT EXISTS public.committee_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    student_id TEXT NOT NULL UNIQUE,
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
    application_status TEXT DEFAULT 'Pending',
    admin_notes TEXT
);

-- 2. Create Officer Profiles Table (Role & Committee Scope Management)
CREATE TABLE IF NOT EXISTS public.officer_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'officer' CHECK (role IN ('super_admin', 'officer')),
    assigned_committee TEXT DEFAULT 'All' CHECK (assigned_committee IN ('All', 'G.A.D Committee', 'Gaming Committee', 'Networking Committee', 'Programming Committee')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create CSO Settings Table (Recruitment Gate Management)
CREATE TABLE IF NOT EXISTS public.cso_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Dynamic Committees Table
CREATE TABLE IF NOT EXISTS public.cso_committees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    description TEXT NOT NULL,
    logo TEXT NOT NULL DEFAULT '/imgs/CSOLOGO.png',
    accent_color TEXT DEFAULT 'from-amber-500 to-amber-600',
    border_glow TEXT DEFAULT 'hover:border-amber-500/50',
    badge_bg TEXT DEFAULT 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    tags JSONB DEFAULT '[]'::jsonb,
    video_url TEXT,
    video_poster TEXT,
    video_title TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.committee_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cso_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cso_committees ENABLE ROW LEVEL SECURITY;

-- 6. RLS Security Policies
CREATE POLICY "Allow authenticated admins to read applications"
ON public.committee_applications FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow public registration insert"
ON public.committee_applications FOR INSERT TO anon, authenticated
WITH CHECK (char_length(student_id) >= 3 AND char_length(first_name) >= 1);

CREATE POLICY "Allow authenticated admins to update applications"
ON public.committee_applications FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow public settings read"
ON public.cso_settings FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow authenticated admin update settings"
ON public.cso_settings FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow public read active committees"
ON public.cso_committees FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow authenticated admin manage committees"
ON public.cso_committees FOR ALL TO authenticated
USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
```

---

## Production Build Verification

To verify and compile the production bundle:

```bash
npm run build
```

---

## License & Attribution

Developed for the **Computer Studies Organization (CSO)** at **ACLC College of Mandaue**.  
*Lead Developer: Melecio Andre Cabahug — CSO Internal Vice Chairman (2025–2026)*
