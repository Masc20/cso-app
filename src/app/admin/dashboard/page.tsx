'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminSidebar from '@/components/layout/AdminSidebar';
import MetricCards from '@/features/admin/components/MetricCards';
import ApplicationsTable from '@/features/admin/components/ApplicationsTable';
import ApplicationDetailModal from '@/features/admin/modals/ApplicationDetailModal';
import Toast from '@/components/ui/Toast';
import { fetchApplications, fetchRegistrationStatus, toggleRegistrationStatus, ApplicationRecord } from '@/features/admin/services/adminApi';
import { RefreshCw, Sparkles, Sun, Moon, Lock, Unlock } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAdminAuth();
  const { darkMode, setDarkMode } = useDarkMode();

  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [appsData, regStatus] = await Promise.all([
      fetchApplications(),
      fetchRegistrationStatus()
    ]);
    setApplications(appsData);
    setIsRegistrationOpen(regStatus);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleRegistration = async () => {
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

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <div className={`min-h-screen w-full flex flex-col md:flex-row bg-[#f2f2ef] text-neutral-900 dark:bg-[#09090b] dark:text-neutral-100 ${darkMode ? 'dark' : ''}`}>
      
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto relative">
        
        {/* Top Action Header & Manual Registration Toggle */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" /> CSO Officer Command Center
            </span>
            <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 mt-1">
              Applicant Records & Recruitment
            </h1>
          </div>

          {/* Right Header Controls: Registration Open/Close Toggle, Refresh, & Theme Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* MANUAL REGISTRATION OPEN/CLOSE TOGGLE BUTTON */}
            <button
              onClick={handleToggleRegistration}
              disabled={toggling}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-2 shadow-md border ${
                isRegistrationOpen
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500/50'
                  : 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500/50'
              }`}
              title="Click to manually open or close registration portal"
            >
              {isRegistrationOpen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {toggling
                ? 'Updating DB...'
                : isRegistrationOpen
                ? 'Registration: OPEN'
                : 'Registration: CLOSED'}
            </button>

            {/* Refresh Data */}
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2.5 rounded-lg bg-[#fafaf8] dark:bg-[#18181b] hover:bg-[#ebebe8] dark:hover:bg-[#27272a] border border-neutral-300 dark:border-[#27272a] text-neutral-800 dark:text-neutral-200 shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(prev => !prev)}
              className="p-2.5 rounded-lg bg-[#fafaf8] dark:bg-[#18181b] hover:bg-[#ebebe8] dark:hover:bg-[#27272a] border border-neutral-300 dark:border-[#27272a] text-neutral-800 dark:text-neutral-200 shadow-sm"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-neutral-800" />}
            </button>
          </div>
        </div>

        {/* Analytics Summary Metric Cards */}
        <MetricCards applications={applications} />

        {/* Main Applicants Table */}
        <ApplicationsTable
          applications={applications}
          onSelectApplication={(app) => setSelectedApp(app)}
        />

        {/* Application Detail & Status Modal */}
        <ApplicationDetailModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdate={loadData}
        />

        {/* Reusable UI Toast Component */}
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />

      </main>

    </div>
  );
}
