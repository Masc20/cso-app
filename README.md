# Computer Studies Organization (CSO) Web Portal

## ACLC College of Mandaue City

An official web application, committee registration portal, and officer command center for the **Computer Studies Organization (CSO)** at ACLC College of Mandaue.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16+ (App Router, Turbopack, React 19)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 with custom dark mode semantic tokens (`.bg-cso-page`, `.bg-cso-card`, `.bg-cso-input`, `.border-cso`)
- **Database & Authentication**: Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS)
- **Icons & Effects**: Lucide React, Canvas Confetti
- **Deployment**: Vercel

---

## Codebase Architecture

The project strictly adheres to a **Feature-Based Modular Architecture**:

```text
src/
├── app/                        # Next.js 14+ App Router Routes & API Endpoints
│   ├── admin/
│   │   ├── dashboard/page.tsx  # Executive Dashboard & Scoped Applicant Management
│   │   └── login/page.tsx       # Officer Login Gateway
│   ├── api/
│   │   ├── admin/login/route.ts # Server In-Memory Rate Limiter & Auth Proxy
│   │   └── register/route.ts    # Student Registration Rate Limiter Engine
│   ├── globals.css             # Tailwind CSS v4 & theme variables
│   ├── layout.tsx              # Root Layout, Plus Jakarta Sans & JetBrains Mono Fonts
│   └── page.tsx                # Main Landing Page Assembly
│
├── components/                 # Shared UI & Layout Primitives
│   ├── index.ts                # Master Components Barrel Export
│   ├── layout/
│   │   ├── types.ts            # Layout Props Contracts (NavbarProps, AdminSidebarProps)
│   │   ├── AdminSidebar.tsx    # Multi-Tab Officer Navigation & Role Profile
│   │   ├── Footer.tsx          # Campus Info & Committee Links
│   │   ├── HeroCSO.tsx         # Title Typography Banner
│   │   └── Navbar.tsx          # Dynamic Glassmorphic Blur Header
│   └── ui/
│       ├── types.ts            # UI Component Props Contracts (ModalProps, ToastProps)
│       ├── FloatingInput.tsx   # Floating-label Input with Tooltips
│       ├── FloatingSelect.tsx  # Floating-label Select Dropdown
│       ├── FloatingTextarea.tsx# Floating-label Textarea with Tooltips
│       ├── Modal.tsx           # Accessible Backdrop Modal
│       └── Toast.tsx           # Reusable Toast Notification System
│
├── data/                       # Centralized Static Registries & Data Constants
│   ├── index.ts                # Master Data Barrel Export
│   ├── committees.ts           # Official Committee Metadata & G.A.D Committee Config
│   ├── mediaGallery.ts         # Showcase Media Items
│   ├── navigation.ts           # Nav Links & Official Facebook Links
│   └── options.ts              # Course, Year Level, Status, & Officer Role Options
│
├── features/                   # Feature-Driven Modular Domain Engines
│   ├── index.ts                # Master Features Barrel Export
│   ├── admin/                  # Executive Admin Portal Domain
│   │   ├── types.ts            # Admin Feature Props Contracts
│   │   ├── components/         # AdminDashboardOverview, ApplicationsTable, OfficerManagementTable
│   │   ├── modals/             # ApplicationDetailModal, EditOfficerModal
│   │   ├── services/adminApi.ts# Supabase RPC & Table Queries
│   │   └── index.ts            # Admin Feature Barrel Export
│   ├── committees/             # Committee Ribbons Domain
│   │   ├── types.ts
│   │   ├── CommitteeRibbons.tsx# Central Emblem Badge & Gold-Ring Ribbon Cards
│   │   └── index.ts
│   ├── gallery/                # Media Showcase Domain
│   └── registration/           # Student Registration Domain
│       ├── types.ts
│       ├── RegistrationPortal.tsx# Registration Form & Deduplication Check
│       └── index.ts
│
├── hooks/                      # Custom React Hooks
│   ├── index.ts                # Hooks Barrel Export
│   ├── useAdminAuth.ts         # Multi-Tier Profile & Auth Hook
│   └── useDarkMode.ts          # Instant 15ms Dark Mode Manager
│
├── lib/                        # Infrastructure, Services & Helper Utilities
│   ├── serverRateLimit.ts      # Server IP Rate Limiter Engine
│   ├── supabase.ts             # Typed Supabase Client
│   └── utils/
│       ├── index.ts            # Master Utils Barrel Export
│       ├── analyticsHelpers.ts # Demand Breakdown & Top Choice Calculators
│       ├── exportHelpers.ts    # CSV Browser Export Engine
│       ├── formatting.ts       # Status Badges & IP Extractors
│       └── validation.ts       # XSS Sanitizer & URL Validators
│
└── types/
    └── index.ts                # Global Database Domain Entities (OfficerProfile, ApplicationRecord)
```

---

## Key Features

1. **Multi-Tier Officer Role-Based Access Control (RBAC)**:
   - **Super Admin**: Full access to global analytics, officer permission editing (`EditOfficerModal.tsx`), role promotion/demotion (`super_admin` vs `officer`), committee scope assignment, and recruitment gate toggling.
   - **Committee Officer**: Hard-locked view to their assigned committee applicants (e.g. `G.A.D Committee`, `Gaming Committee`, `Networking Committee`, `Programming Committee`) with visual lock indicator.
2. **Dual-Stream Data Pipeline**:
   - Executive metrics calculate global demand distribution across all 4 committees (`fetchApplications('All')`), while applicant table data respects the officer's assigned scope.
3. **Primary & Secondary Committee Deduplication**:
   - Registration form dynamically filters out the chosen Primary Committee from the Secondary Preference dropdown, auto-resetting duplicates.
4. **Security & Rate Limiting Engine**:
   - Protects against brute-force attacks with a 5-attempt / 15-minute IP lock on admin login and 10-attempt / 30-second cooldown on registration submissions.
5. **Glassmorphic Design System**:
   - Dynamic hybrid glassmorphic navbar (`backdrop-blur-md bg-cso-card/90`), restored central floating CSO emblem badge, and dual-clipped V-bottom ribbon cards.

---

## Getting Started

### 1. Prerequisites

- **Node.js**: `18.x` or higher
- **Package Manager**: `npm`

### 2. Installation & Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-org/CSO_Web.git
cd CSO_Web/cso-app
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
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.committee_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cso_settings ENABLE ROW LEVEL SECURITY;

-- 5. RLS Security Policies
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
