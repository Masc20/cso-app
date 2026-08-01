'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminSidebar from '@/components/layout/AdminSidebar';
import MetricCards from '@/features/admin/components/MetricCards';
import ApplicationsTable from '@/features/admin/components/ApplicationsTable';
import ApplicationDetailModal from '@/features/admin/components/ApplicationDetailModal';
import { fetchApplications, ApplicationRecord } from '@/features/admin/services/adminApi';
import { RefreshCw, Sparkles, Sun, Moon } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAdminAuth();
  const { darkMode, setDarkMode } = useDarkMode();

  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchApplications();
    setApplications(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <div className={`min-h-screen w-full flex flex-col md:flex-row bg-[#f2f2ef] text-neutral-900 dark:bg-[#09090b] dark:text-neutral-100 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Top Action Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" /> CSO Officer Command Center
            </span>
            <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 mt-1">
              Applicant Records & Recruitment
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {/* Refresh Data */}
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2.5 rounded-full bg-[#fafaf8] dark:bg-[#18181b] hover:bg-[#ebebe8] dark:hover:bg-[#27272a] border border-neutral-300 dark:border-[#27272a] text-neutral-800 dark:text-neutral-200 transition-colors shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(prev => !prev)}
              className="p-2.5 rounded-full bg-[#fafaf8] dark:bg-[#18181b] hover:bg-[#ebebe8] dark:hover:bg-[#27272a] border border-neutral-300 dark:border-[#27272a] text-neutral-800 dark:text-neutral-200 transition-colors shadow-sm"
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
        {selectedApp && (
          <ApplicationDetailModal
            application={selectedApp}
            onClose={() => setSelectedApp(null)}
            onUpdate={loadData}
          />
        )}

      </main>

    </div>
  );
}
