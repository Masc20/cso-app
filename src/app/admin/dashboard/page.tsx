'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth, useDarkMode } from '@/hooks';
import { AdminSidebar } from '@/components/layout';
import { Toast } from '@/components/ui';
import { 
  AdminDashboardOverview, 
  ApplicationsTable, 
  OfficerManagementTable, 
  ApplicationDetailModal,
  fetchApplications, 
  fetchRegistrationStatus, 
  toggleRegistrationStatus, 
  fetchOfficerProfiles,
  updateOfficerProfile
} from '@/features/admin';
import type { ApplicationRecord, OfficerProfile, ToastType } from '@/types';
import { RefreshCw, Sparkles, Sun, Moon, Loader2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated, profile, logout } = useAdminAuth();
  const { darkMode, setDarkMode } = useDarkMode();

  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Dual-stream datasets: global for overview metrics, scoped for applicant table
  const [allApplications, setAllApplications] = useState<ApplicationRecord[]>([]);
  const [scopedApplications, setScopedApplications] = useState<ApplicationRecord[]>([]);
  const [officers, setOfficers] = useState<OfficerProfile[]>([]);
  
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRecord | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [toastState, setToastState] = useState<{ message: string; type: ToastType } | null>(null);

  const isSuperAdmin = profile?.role === 'super_admin';
  const assignedScope = isSuperAdmin ? 'All' : profile?.assigned_committee || 'All';

  // Fetch Dual Stream Applications, Officers, and Settings
  const loadDashboardData = useCallback(async () => {
    setDataLoading(true);
    try {
      // 1. Fetch Global Applications for Overview Analytics & Demand Distribution
      const globalApps = await fetchApplications('All');
      setAllApplications(globalApps);

      // 2. Fetch Scoped Applications for Applicant Records Table (Committee-locked for Officers)
      if (assignedScope === 'All') {
        setScopedApplications(globalApps);
      } else {
        const scoped = await fetchApplications(assignedScope);
        setScopedApplications(scoped);
      }

      // 3. Fetch Registration Gate Status
      const openStatus = await fetchRegistrationStatus();
      setIsRegistrationOpen(openStatus);

      // 4. Fetch Officers if Super Admin
      if (isSuperAdmin) {
        const officerList = await fetchOfficerProfiles();
        setOfficers(officerList);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setToastState({ message: 'Failed to load dashboard data. Please try again.', type: 'error' });
    } finally {
      setDataLoading(false);
    }
  }, [assignedScope, isSuperAdmin]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/admin/login');
    } else if (isAuthenticated) {
      loadDashboardData();
    }
  }, [authLoading, isAuthenticated, router, loadDashboardData]);

  const handleToggleRegistration = async () => {
    const newStatus = !isRegistrationOpen;
    setIsRegistrationOpen(newStatus);
    const success = await toggleRegistrationStatus(newStatus);
    if (success) {
      setToastState({
        message: `Registration portal ${newStatus ? 'OPENED' : 'CLOSED'} successfully.`,
        type: newStatus ? 'success' : 'closed'
      });
    } else {
      setIsRegistrationOpen(!newStatus); // Revert on failure
      setToastState({ message: 'Failed to update registration status.', type: 'error' });
    }
  };

  const handleUpdateApplicationStatus = async (id: string, status: string, notes?: string) => {
    // Optimistic Update
    setAllApplications(prev => prev.map(a => a.id === id ? { ...a, application_status: status, admin_notes: notes !== undefined ? notes : a.admin_notes } : a));
    setScopedApplications(prev => prev.map(a => a.id === id ? { ...a, application_status: status, admin_notes: notes !== undefined ? notes : a.admin_notes } : a));
    
    const toastType: ToastType = status === 'Rejected' ? 'delete' : 'success';
    setToastState({ message: `Application status updated to "${status}".`, type: toastType });
  };

  const handleUpdateOfficerPermissions = async (id: string, role: 'super_admin' | 'officer', committee: OfficerProfile['assigned_committee']) => {
    const success = await updateOfficerProfile(id, role, committee);
    if (success) {
      setToastState({ message: 'Officer profile permissions updated.', type: 'success' });
      loadDashboardData();
      return true;
    } else {
      setToastState({ message: 'Failed to update officer profile.', type: 'error' });
      return false;
    }
  };

  if (authLoading || (dataLoading && allApplications.length === 0)) {
    return (
      <div className="min-h-screen bg-cso-page flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
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
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Computer Studies Organization &bull; Command Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight mt-0.5">
              {activeTab === 'dashboard' && 'Executive Overview'}
              {activeTab === 'applications' && 'Applicant Records'}
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

        {/* Tab 3: Officer Management Table (Super Admin Only) */}
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

      {/* Dynamic Visual Toast Primitive */}
      <Toast 
        message={toastState?.message || null} 
        type={toastState?.type}
        onClose={() => setToastState(null)} 
      />

    </div>
  );
}
