'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminDashboardOverview from '@/features/admin/components/AdminDashboardOverview';
import ApplicationsTable from '@/features/admin/components/ApplicationsTable';
import OfficerManagementTable from '@/features/admin/components/OfficerManagementTable';
import ApplicationDetailModal from '@/features/admin/modals/ApplicationDetailModal';
import Toast from '@/components/ui/Toast';
import { 
  fetchApplications, 
  fetchRegistrationStatus, 
  toggleRegistrationStatus, 
  fetchOfficerProfiles,
  updateOfficerProfile,
  ApplicationRecord, 
  OfficerProfile 
} from '@/features/admin/services/adminApi';
import { RefreshCw, Sparkles, Sun, Moon, Loader2 } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { loading: authLoading, isAuthenticated, profile, logout } = useAdminAuth();
  const { darkMode, setDarkMode } = useDarkMode();

  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Dual-stream datasets: global for overview metrics, scoped for applicant table
  const [globalApplications, setGlobalApplications] = useState<ApplicationRecord[]>([]);
  const [scopedApplications, setScopedApplications] = useState<ApplicationRecord[]>([]);
  const [officerProfiles, setOfficerProfiles] = useState<OfficerProfile[]>([]);
  
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);

  // Protect Admin Route: Redirect to /admin/login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const loadData = useCallback(async () => {
    setLoading(true);
    const assignedScope = profile?.assigned_committee || 'All';
    
    // Fetch global applications for overview metrics, scoped applications for table, & officer profiles for management
    const [globalData, scopedData, regStatus, officersData] = await Promise.all([
      fetchApplications('All'),
      fetchApplications(assignedScope),
      fetchRegistrationStatus(),
      fetchOfficerProfiles()
    ]);

    setGlobalApplications(globalData);
    setScopedApplications(scopedData);
    setIsRegistrationOpen(regStatus);

    // Fallback: If DB table officer_profiles has no rows yet, include current logged-in officer profile
    if (officersData.length === 0 && profile) {
      setOfficerProfiles([profile]);
    } else {
      setOfficerProfiles(officersData);
    }

    setLoading(false);
  }, [profile]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  const handleToggleRegistration = async () => {
    if (profile?.role === 'officer') {
      setToastType('error');
      setToastMessage('Permission Denied: Only Super Admin officers can open or close registration.');
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    setToggling(true);
    const nextState = !isRegistrationOpen;
    const success = await toggleRegistrationStatus(nextState);

    if (success) {
      setIsRegistrationOpen(nextState);
      setToastType(nextState ? 'success' : 'error');
      setToastMessage(
        nextState 
          ? 'Registration Portal OPENED in Supabase! Students can now register.' 
          : 'Registration Portal CLOSED in Supabase! Form locked.'
      );
    } else {
      setToastType('error');
      setToastMessage('Failed to update Supabase cso_settings table. Please check Supabase credentials & SQL RLS policy.');
    }

    setToggling(false);

    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const handleUpdateOfficerProfile = async (
    id: string, 
    role: 'super_admin' | 'officer', 
    committee: OfficerProfile['assigned_committee']
  ) => {
    const success = await updateOfficerProfile(id, role, committee);
    if (success) {
      setToastType('success');
      setToastMessage('Officer permissions updated successfully!');
      loadData();
    } else {
      // Local state fallback if DB table update note
      setOfficerProfiles(prev => prev.map(p => p.id === id ? { ...p, role, assigned_committee: committee } : p));
      setToastType('info');
      setToastMessage('Updated local officer permissions.');
    }
    setTimeout(() => setToastMessage(null), 4000);
    return true;
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/admin/login');
  };

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className={`min-h-screen w-full bg-cso-page flex items-center justify-center ${darkMode ? 'dark' : ''}`}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Verifying officer session...</span>
        </div>
      </div>
    );
  }

  const isSuperAdmin = !profile || profile.role === 'super_admin';

  return (
    <div className={`min-h-screen w-full flex flex-col md:flex-row bg-cso-page text-neutral-900 dark:text-neutral-100 ${darkMode ? 'dark' : ''}`}>
      
      {/* Sidebar Navigation with Officer Profile Scope & 3 Navigation Tabs */}
      <AdminSidebar
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto relative">
        
        {/* Top Action Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" /> {profile?.full_name || 'CSO Officer'} • {isSuperAdmin ? 'Super Admin' : profile?.assigned_committee}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 mt-1">
              {activeTab === 'dashboard' && 'CSO Executive Dashboard'}
              {activeTab === 'applications' && 'Committee Applicant Records'}
              {activeTab === 'officers' && 'Officer Account Management'}
            </h1>
          </div>

          {/* Right Header Controls: Refresh & Theme */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2.5 rounded-lg bg-cso-card border border-cso text-neutral-800 dark:text-neutral-200 shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setDarkMode(prev => !prev)}
              className="p-2.5 rounded-lg bg-cso-card border border-cso text-neutral-800 dark:text-neutral-200 shadow-sm"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-neutral-800" />}
            </button>
          </div>
        </div>

        {/* Tab View 1: Executive Dashboard & Analytics */}
        {activeTab === 'dashboard' && (
          <AdminDashboardOverview
            applications={globalApplications}
            isRegistrationOpen={isRegistrationOpen}
            onToggleRegistration={handleToggleRegistration}
            toggling={toggling}
            profile={profile}
            onNavigateToApplications={() => setActiveTab('applications')}
          />
        )}

        {/* Tab View 2: Committee Applicant Records Table */}
        {activeTab === 'applications' && (
          <ApplicationsTable
            applications={scopedApplications}
            userAssignedCommittee={profile?.assigned_committee}
            onSelectApplication={(app) => setSelectedApp(app)}
          />
        )}

        {/* Tab View 3: Officer User Management (Super Admin Only) */}
        {activeTab === 'officers' && (
          <OfficerManagementTable
            officers={officerProfiles}
            onUpdateOfficer={handleUpdateOfficerProfile}
            onRefresh={loadData}
          />
        )}

        {/* Application Detail Modal */}
        <ApplicationDetailModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdate={loadData}
        />

        {/* Toast Notification System */}
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />

      </main>

    </div>
  );
}
