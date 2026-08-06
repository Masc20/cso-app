import type React from 'react';
import type { LucideIcon } from 'lucide-react';

/**
 * ====================================================================
 * GLOBAL APPLICATION DOMAIN ENTITY MODELS & COMPONENT CONTRACTS
 * ====================================================================
 */

/* --------------------------------------------------------------------
 * 1. DOMAIN ENTITY MODELS
 * -------------------------------------------------------------------- */



export interface OfficerProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'officer';
  assigned_committee: 'All' | 'G.A.D Committee' | 'Gaming Committee' | 'Networking Committee' | 'Programming Committee';
  created_at?: string;
}

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

export interface Committee {
  id: string;
  name: string;
  shortName: string;
  short_name?: string;
  description: string;
  logo: string;
  accentColor?: string;
  borderGlow?: string;
  badgeBg?: string;
  Icon?: LucideIcon;
  iconClassName?: string;
  tags: string[];
  videoUrl?: string;
  video_url?: string;
  videoPoster?: string;
  video_poster?: string;
  videoTitle?: string;
  video_title?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  category: 'Awards' | 'Certificates' | 'Activities' | 'Officers';
  src: string;
  subtitle: string;
}

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

export interface RateLimitRecord {
  count: number;
  resetTime: number;
  lockedUntil: number;
}

/* --------------------------------------------------------------------
 * 2. COMPONENT PROPS CONTRACTS
 * -------------------------------------------------------------------- */

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export type ToastType = 'success' | 'info' | 'error' | 'warning' | 'delete' | 'closed';

export interface ToastProps {
  message: string | null;
  type?: ToastType;
  onClose: () => void;
  stackIndex?: number;
  autoDismiss?: boolean;
}

export interface FloatingInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  icon?: React.ReactNode;
  infoTooltip?: string;
  errorMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface FloatingTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string;
  infoTooltip?: string;
  errorMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface FloatingSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  options: Array<{ value: string; label: string } | string | [string, string]>;
  icon?: React.ReactNode;
  infoTooltip?: string;
  placeholderOption?: string;
  errorMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface AdminSidebarProps {
  currentTab?: 'overview' | 'applications' | 'officers' | 'committees' | 'dashboard';
  activeTab?: string;
  setCurrentTab?: (tab: 'overview' | 'applications' | 'officers' | 'committees' | 'dashboard') => void;
  setActiveTab?: (tab: string) => void;
  onLogout: () => void;
  officerProfile?: OfficerProfile | null;
  profile?: OfficerProfile | null;
}

export interface NavbarProps {
  darkMode?: boolean;
  setDarkMode?: (val: boolean | ((prev: boolean) => boolean)) => void;
  onNavigateRegister?: () => void;
  onSelectCommittee?: (name: string) => void;
}

export interface CommitteeRibbonsProps {
  onSelectCommittee: (name: string) => void;
}

export interface RegistrationPortalProps {
  selectedCommittee?: string;
}

export interface AdminDashboardOverviewProps {
  applications: ApplicationRecord[];
  officers?: OfficerProfile[];
  onNavigateTab?: (tab: 'overview' | 'applications' | 'officers' | 'dashboard') => void;
  isRegistrationOpen: boolean;
  onToggleRegistration: () => void;
  toggling?: boolean;
  profile?: OfficerProfile | null;
  onNavigateToApplications?: () => void;
}

export interface ApplicationsTableProps {
  applications: ApplicationRecord[];
  onViewDetails?: (app: ApplicationRecord) => void;
  onSelectApplication?: (app: ApplicationRecord) => void;
  onUpdateStatus?: (id: string, status: string) => void;
  userAssignedCommittee?: string;
  officerProfile?: OfficerProfile | null;
}

export interface MetricCardsProps {
  applications: ApplicationRecord[];
  officers?: OfficerProfile[];
}

export interface ApplicationDetailModalProps {
  isOpen?: boolean;
  onClose: () => void;
  application: ApplicationRecord | null;
  onUpdate?: (id: string, status: string, notes?: string) => void;
  onSaveNotes?: (id: string, notes: string) => void;
  onUpdateStatus?: (id: string, status: string) => void;
}

export interface EditOfficerModalProps {
  isOpen?: boolean;
  onClose: () => void;
  officer: OfficerProfile | null;
  onSave: (id: string, role: 'super_admin' | 'officer', committee: OfficerProfile['assigned_committee']) => void;
}

export interface CommitteeVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  committee: Committee | null;
  onApply: (committeeId: string) => void;
}

export interface EditCommitteeModalProps {
  isOpen: boolean;
  onClose: () => void;
  committee: Committee | null;
  onSave: (committeeData: Partial<Committee>) => Promise<boolean>;
  isSuperAdmin: boolean;
}

export interface CommitteeManagementTableProps {
  committees: Committee[];
  officerProfile: OfficerProfile | null;
  onSaveCommittee: (committeeData: Partial<Committee>) => Promise<boolean>;
  onToggleActive: (id: string, isActive: boolean) => Promise<boolean>;
  onDeleteCommittee: (id: string) => Promise<boolean>;
  onRefresh: () => void;
}

export interface EditCommitteeModalProps {
  isOpen: boolean;
  onClose: () => void;
  committee: Committee | null;
  onSave: (committeeData: Partial<Committee>) => Promise<boolean>;
  isSuperAdmin: boolean;
}

export interface OfficerManagementTableProps {
  officers: OfficerProfile[];
  onUpdateOfficer: (id: string, role: 'super_admin' | 'officer', committee: OfficerProfile['assigned_committee']) => Promise<boolean>;
  onRefresh: () => void;
}


export interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}
