import type { LucideIcon } from 'lucide-react';

/**
 * CSO Admin Officer Profile & Role Permissions
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
 * Committee Application Record from Supabase PostgreSQL database
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
 * CSO Committee Metadata & Visual Config
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
 * Media Gallery Carousel Item
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

/**
 * UI Toast Notification System
 */
export type ToastType = 'success' | 'info' | 'error';

export interface ToastProps {
  message: string | null;
  type?: ToastType;
  onClose: () => void;
}

/**
 * Reusable Modal Container Props
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/**
 * Floating Input & Textarea Props
 */
export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

/**
 * Table Pagination Configuration
 */
export interface PaginationConfig {
  currentPage: number;
  rowsPerPage: number;
  totalRecords: number;
  totalPages: number;
}
