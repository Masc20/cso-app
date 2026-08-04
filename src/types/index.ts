import type { LucideIcon } from 'lucide-react';

/**
 * ====================================================================
 * GLOBAL APPLICATION DOMAIN ENTITY MODELS
 * ====================================================================
 */

/**
 * CSO Admin Officer Profile & Role Permissions Entity
 */
export interface OfficerProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'officer';
  assigned_committee: 'All' | 'G.A.D Committee' | 'Gaming Committee' | 'Networking Committee' | 'Programming Committee';
  created_at?: string;
}

/**
 * Committee Application Record Entity from Supabase PostgreSQL
 */
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
 * CSO Committee Visual & Metadata Entity
 */
export interface Committee {
  id: string;
  name: string;
  shortName: string;
  description: string;
  logo: string;
  accentColor: string;
  borderGlow: string;
  badgeBg: string;
  Icon: LucideIcon;
  iconClassName: string;
  tags: string[];
}

/**
 * Media Gallery Carousel Item Entity
 */
export interface MediaItem {
  id: string;
  title: string;
  category: 'Awards' | 'Certificates' | 'Activities' | 'Officers';
  src: string;
  subtitle: string;
}

/**
 * Registration Portal Student Form Payload
 */
export interface RegistrationFormData {
  studentId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  facebookLink: string;
  yearLevel: string;
  courseProgram: string;
  primaryCommittee: string;
  secondaryCommittee: string;
  portfolioUrl: string;
  motivationStatement: string;
}

/**
 * Server In-Memory Rate Limiter Record
 */
export interface RateLimitRecord {
  count: number;
  resetTime: number;
  lockedUntil: number;
}
