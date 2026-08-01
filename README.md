# Computer Studies Organization (CSO) Web Portal 🚀
### ACLC College Mandaue City

An official web application and committee registration portal for the **Computer Studies Organization (CSO)** at ACLC College Mandaue City. Built with modern web technologies, responsive dual-theme design (Soft Anti-Glare Light Mode & Obsidian Dark Mode), a full-screen interactive media gallery, and Supabase database integration.

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (React 19, Turbopack, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with `@custom-variant dark`
- **Database / BaaS**: Supabase (PostgreSQL, Auth, RLS Policies)
- **Icons & Effects**: Lucide React, Canvas Confetti

---

## 📁 Codebase Architecture

The project follows a **Feature-Driven Modular Architecture**:

```text
cso-app/src/
├── app/
│   ├── favicon.ico
│   ├── globals.css           # Tailwind v4 imports & theme CSS variables
│   ├── icon.png              # Title icon (/imgs/CSOLOGO.png)
│   ├── layout.tsx            # Root layout & SEO metadata
│   └── page.tsx              # Home page assembly & root dark class syncing
├── components/
│   ├── layout/
│   │   ├── Footer.tsx        # Responsive footer with committee logos & FB link
│   │   ├── HeroCSO.tsx       # Bold CSO typography hero section
│   │   └── Navbar.tsx        # Sticky header with grouped nav, FB link & theme toggle
│   └── ui/
│       ├── FloatingInput.tsx # Animated floating-label text input
│       └── FloatingTextarea.tsx # Animated floating-label textarea
├── data/
│   └── committees.ts         # Official committee metadata
├── features/
│   ├── committees/
│   │   └── CommitteeRibbons.tsx # 4 Committee banner ribbons grid
│   ├── gallery/
│   │   └── MediaCarousel.tsx # Full-screen width media slider & lightbox modal
│   └── registration/
│       ├── form.ts           # Form types & default values
│       └── RegistrationPortal.tsx # Supabase application form & sanitization
├── hooks/
│   └── useDarkMode.ts        # Dark mode state manager & document class syncer
└── lib/
    └── supabase.ts           # Supabase client instance & TypeScript interfaces
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
    motivation_statement TEXT NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.committee_applications ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policy for public registration inserts
CREATE POLICY "Allow public registration inserts" 
ON public.committee_applications 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- 4. Create RLS Policy for authenticated officer read access
CREATE POLICY "Allow authenticated read access" 
ON public.committee_applications 
FOR SELECT 
TO authenticated 
USING (true);
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
