import type { ApplicationRecord, OfficerProfile } from '@/types';

export interface ApplicationsTableProps {
  applications: ApplicationRecord[];
  onSelectApplication: (app: ApplicationRecord) => void;
  userAssignedCommittee?: string;
}

export interface AdminDashboardOverviewProps {
  applications: ApplicationRecord[];
  isRegistrationOpen: boolean;
  onToggleRegistration: () => void;
  toggling: boolean;
  profile?: OfficerProfile | null;
  onNavigateToApplications: () => void;
}

export interface OfficerManagementTableProps {
  officers: OfficerProfile[];
  onUpdateOfficer: (id: string, role: 'super_admin' | 'officer', committee: OfficerProfile['assigned_committee']) => Promise<boolean>;
  onRefresh: () => void;
}

export interface MetricCardsProps {
  applications: ApplicationRecord[];
}

export interface ApplicationDetailModalProps {
  application: ApplicationRecord | null;
  onClose: () => void;
  onUpdate: () => void;
}

export interface EditOfficerModalProps {
  officer: OfficerProfile | null;
  onClose: () => void;
  onSave: (id: string, role: 'super_admin' | 'officer', committee: OfficerProfile['assigned_committee']) => Promise<boolean>;
}
