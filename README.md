# Computer Studies Organization (CSO) Web Portal 🚀
### ACLC College Mandaue City

An official web application, committee registration portal, and officer command center for the **Computer Studies Organization (CSO)** at ACLC College of Mandaue.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (React 19, Turbopack, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with `@custom-variant dark` (Obsidian Charcoal `#09090b` / Warm Stone `#fafaf8`)
- **Database & Auth**: Supabase (PostgreSQL, Auth, Row Level Security)
- **Icons & Effects**: Lucide React, Canvas Confetti

## 📁 Codebase Architecture

The project strictly follows a **Feature-Driven Modular Architecture**:

```text
cso-app/src/
├── app/
│   ├── admin/
│   │   ├── dashboard/page.tsx   # Admin Officer Command Center
│   │   └── login/page.tsx       # Officer Login Page
│   ├── favicon.ico
│   ├── globals.css              # Tailwind v4 imports & theme CSS variables
│   ├── icon.png                 # Title icon (/imgs/CSOLOGO.png)
│   ├── layout.tsx               # Root layout & SEO metadata
│   └── page.tsx                 # Home page assembly & root dark class syncing
├── components/
│   ├── layout/
│   │   ├── AdminSidebar.tsx     # Admin navigation sidebar & logout controls
│   │   ├── Footer.tsx           # Footer with committee logos & FB link
│   │   ├── HeroCSO.tsx          # CSO typography hero section
│   │   └── Navbar.tsx           # Sticky header with grouped nav & theme toggle
│   └── ui/
│       ├── FloatingInput.tsx    # Animated floating-label text input
│       ├── FloatingTextarea.tsx # Animated floating-label textarea
│       ├── Modal.tsx            # Reusable modal wrapper (Esc & click-outside dismiss)
│       └── Toast.tsx            # Floating toast notification primitive
├── data/
│   └── committees.ts            # Official committee metadata
├── features/
│   ├── admin/
│   │   ├── components/
│   │   │   ├── ApplicationsTable.tsx  # Applicant data grid & filters
│   │   │   └── MetricCards.tsx        # Analytics summary counters
│   │   ├── modals/
│   │   │   └── ApplicationDetailModal.tsx # Full applicant detail & notes editor
│   │   └── services/
│   │       └── adminApi.ts      # Supabase query helpers & setting persistence
│   ├── committees/
│   │   └── CommitteeRibbons.tsx # 4 Committee banner ribbons grid
│   ├── gallery/
│   │   └── MediaCarousel.tsx    # Full-screen width media slider & lightbox
│   └── registration/
│       ├── form.ts              # Form types & default values
│       └── RegistrationPortal.tsx # Application form & live open/closed notice
├── hooks/
│   ├── useAdminAuth.ts          # Supabase auth session hook
│   └── useDarkMode.ts           # Dark mode state manager & document class syncer
└── lib/
    └── supabase.ts              # Supabase client instance & TypeScript interfaces
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or higher
- npm, pnpm, or yarn

### 2. Installation & Setup
Clone the repository and install dependencies:

```bash
cd cso-app
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the `cso-app` root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Running Locally
Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
To access the Admin Portal, visit [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## 🗄️ Supabase Database Setup

Run the following script in your **Supabase SQL Editor**:

```sql
-- 1. Create the committee applications table
CREATE TABLE IF NOT EXISTS public.committee_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
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
    application_status TEXT DEFAULT 'Pending',
    admin_notes TEXT
);

-- 2. Create the CSO global settings table (For manual registration toggle)
CREATE TABLE IF NOT EXISTS public.cso_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert initial registration status
INSERT INTO public.cso_settings (key, value)
VALUES ('is_registration_open', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.committee_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cso_settings ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Allow public registration inserts" 
ON public.committee_applications FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated read applications" 
ON public.committee_applications FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated update applications" 
ON public.committee_applications FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow public read settings" 
ON public.cso_settings FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow authenticated admin update settings" 
ON public.cso_settings FOR ALL TO authenticated USING (true);
```

---

## 🏗️ Production Build

To test and compile the production build:

```bash
npm run build
```

---

## 📄 License & Attribution

Developed for the **Computer Studies Organization (CSO)** at **ACLC College Of Mandaue**.
