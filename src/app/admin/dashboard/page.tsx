'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth, useDarkMode, useToast } from '@/hooks';
import { AdminSidebar } from '@/components/layout';
import { 
  AdminDashboardOverview, 
  ApplicationsTable, 
  OfficerManagementTable, 
  CommitteeManagementTable,
  ApplicationDetailModal,
  fetchApplications, 
  fetchRegistrationStatus, 
  toggleRegistrationStatus, 
  fetchOfficerProfiles,
  updateOfficerProfile,
  fetchCommittees,
  saveCommittee,
  toggleCommitteeActive,
  deleteCommittee
} from '@/features/admin';
import type { ApplicationRecord, OfficerProfile, Committee, ToastType } from '@/types';
import { RefreshCw, Sun, Moon, Loader2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated, profile, logout } = useAdminAuth();
  const { darkMode, setDarkMode } = useDarkMode();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Dual-stream datasets: global for overview metrics, scoped for applicant table
  const [allApplications, setAllApplications] = useState<ApplicationRecord[]>([]);
  const [scopedApplications, setScopedApplications] = useState<ApplicationRecord[]>([]);
  const [officers, setOfficers] = useState<OfficerProfile[]>([]);
  const [committees, setCommittees] = useState<Committee[]>([]);
  
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRecord | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  const isSuperAdmin = profile?.role === 'super_admin';
  const assignedScope = isSuperAdmin ? 'All' : profile?.assigned_committee || 'All';

  // Fetch Applications, Officers, Committees, and Settings
  const loadDashboardData = useCallback(async () => {
    setDataLoading(true);
    try {
      // 1. Fetch Global Applications for Overview Analytics
      const globalApps = await fetchApplications('All');
      setAllApplications(globalApps);

      // 2. Fetch Scoped Applications for Applicant Records Table
      if (assignedScope === 'All') {
        setScopedApplications(globalApps);
      } else {
        const scoped = await fetchApplications(assignedScope);
        setScopedApplications(scoped);
      }

      // 3. Fetch Registration Gate Status
      const openStatus = await fetchRegistrationStatus();
      setIsRegistrationOpen(openStatus);

      // 4. Fetch Officers for Admin Management
      if (isSuperAdmin) {
        const officerList = await fetchOfficerProfiles();
        setOfficers(officerList);
      }

      // 5. Fetch Dynamic Committees & Showcase Videos
      const commList = await fetchCommittees(true); // Include inactive for admin
      setCommittees(commList);

    } catch (err) {
      console.warn('Dashboard data fetch exception:', err);
    } finally {
      setDataLoading(false);
    }
  }, [assignedScope, isSuperAdmin]);

  // Auth gate check
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/admin/login');
      } else {
        loadDashboardData();
      }
    }
  }, [authLoading, isAuthenticated, router, loadDashboardData]);

  // Handle Registration Gate Toggle
  const handleToggleRegistration = async () => {
    const nextState = !isRegistrationOpen;
    const success = await toggleRegistrationStatus(nextState);
    if (success) {
      setIsRegistrationOpen(nextState);
      showToast(
        `Recruitment portal is now ${nextState ? 'OPEN' : 'CLOSED'}.`,
        nextState ? 'success' : 'closed'
      );
    } else {
      showToast('Failed to update registration status.', 'error');
    }
  };

  // Status & Permission Update Handlers
  const handleUpdateApplicationStatus = (id: string, status: string, notes?: string) => {
    // Optimistic local state update
    setAllApplications(prev => prev.map(a => a.id === id ? { ...a, application_status: status, admin_notes: notes ?? a.admin_notes } : a));
    setScopedApplications(prev => prev.map(a => a.id === id ? { ...a, application_status: status, admin_notes: notes ?? a.admin_notes } : a));
    
    const toastType: ToastType = status === 'Rejected' ? 'delete' : 'success';
    showToast(`Application status updated to "${status}".`, toastType);
  };

  const handleUpdateOfficerPermissions = async (id: string, role: 'super_admin' | 'officer', committee: OfficerProfile['assigned_committee']) => {
    const success = await updateOfficerProfile(id, role, committee);
    if (success) {
      showToast('Officer profile permissions updated.', 'success');
      loadDashboardData();
      return true;
    } else {
      showToast('Failed to update officer profile.', 'error');
      return false;
    }
  };

  // Committee CRUD Handlers
  const handleSaveCommittee = async (committeeData: Partial<Committee>) => {
    const success = await saveCommittee(committeeData);
    if (success) {
      showToast(`Committee "${committeeData.name || committeeData.shortName}" saved successfully.`, 'success');
      loadDashboardData();
      return true;
    } else {
      showToast('Failed to save committee record.', 'error');
      return false;
    }
  };

  const handleToggleCommitteeActive = async (id: string, isActive: boolean) => {
    const success = await toggleCommitteeActive(id, isActive);
    if (success) {
      showToast(`Committee status updated to ${isActive ? 'Active' : 'Archived'}.`, isActive ? 'success' : 'warning');
      loadDashboardData();
      return true;
    } else {
      showToast('Failed to update committee active status.', 'error');
      return false;
    }
  };

  const handleDeleteCommittee = async (id: string) => {
    const success = await deleteCommittee(id);
    if (success) {
      showToast('Committee record deleted successfully.', 'delete');
      loadDashboardData();
      return true;
    } else {
      showToast('Failed to delete committee record.', 'error');
      return false;
    }
  };

  if (authLoading || (dataLoading && allApplications.length === 0)) {
    return (
      <div className="min-h-screen bg-cso-page flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#f59e0b]" />
          <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest">
            Loading CSO Command Center...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cso-page flex flex-col md:flex-row transition-colors">
      
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={logout}
        profile={profile}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-cso">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Computer Studies Organization &bull; Command Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight mt-0.5">
              {activeTab === 'dashboard' && 'Executive Overview'}
              {activeTab === 'applications' && 'Applicant Records'}
              {activeTab === 'committees' && 'Committees & Video Showcases'}
              {activeTab === 'officers' && 'Officer Management'}
            </h1>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={loadDashboardData}
              className="p-2.5 rounded-lg border border-cso bg-cso-card hover:bg-neutral-200 dark:hover:bg-[#27272a] text-neutral-700 dark:text-neutral-300 transition-colors shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin text-amber-500' : ''}`} />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-lg border border-cso bg-cso-card hover:bg-neutral-200 dark:hover:bg-[#27272a] text-neutral-700 dark:text-neutral-300 transition-colors shadow-sm"
              title="Toggle Light/Dark Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
            </button>
          </div>
        </div>

        {/* Tab 1: Executive Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <AdminDashboardOverview
            applications={allApplications}
            officers={officers}
            onNavigateTab={(tab: 'overview' | 'applications' | 'officers' | 'dashboard') => setActiveTab(tab)}
            isRegistrationOpen={isRegistrationOpen}
            onToggleRegistration={handleToggleRegistration}
          />
        )}

        {/* Tab 2: Applicant Records Table */}
        {activeTab === 'applications' && (
          <ApplicationsTable
            applications={scopedApplications}
            onSelectApplication={(app) => setSelectedApplication(app)}
            userAssignedCommittee={assignedScope}
          />
        )}

        {/* Tab 3: Committees & Video Showcase Manager */}
        {activeTab === 'committees' && (
          <CommitteeManagementTable
            committees={committees}
            officerProfile={profile}
            onSaveCommittee={handleSaveCommittee}
            onToggleActive={handleToggleCommitteeActive}
            onDeleteCommittee={handleDeleteCommittee}
            onRefresh={loadDashboardData}
          />
        )}

        {/* Tab 4: Officer Management Table (Super Admin Only) */}
        {activeTab === 'officers' && isSuperAdmin && (
          <OfficerManagementTable
            officers={officers}
            onUpdateOfficer={handleUpdateOfficerPermissions}
            onRefresh={loadDashboardData}
          />
        )}

      </main>

      {/* Feature Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdate={(id, status, notes) => {
            handleUpdateApplicationStatus(id, status, notes);
            setSelectedApplication(null);
          }}
        />
      )}

    </div>
  );
}
