import type { OfficerProfile } from '@/types';

export interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onSelectCommittee?: (name: string) => void;
}

export interface AdminSidebarProps {
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile?: OfficerProfile | null;
}
