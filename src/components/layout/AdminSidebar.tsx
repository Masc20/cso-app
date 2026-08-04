'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  LogOut, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import type { AdminSidebarProps } from '@/types';

export default function AdminSidebar({ 
  onLogout, 
  activeTab, 
  setActiveTab, 
  currentTab,
  setCurrentTab,
  profile,
  officerProfile 
}: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeOfficer = profile || officerProfile;
  const currentActiveTab = activeTab || currentTab || 'dashboard';

  const handleTabSelect = (tab: string) => {
    if (setActiveTab) setActiveTab(tab);
    if (setCurrentTab) setCurrentTab(tab as any);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cso_admin_sidebar_collapsed');
      if (saved !== null) setCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cso_admin_sidebar_collapsed', String(next));
    }
  };

  const isSuperAdmin = activeOfficer?.role === 'super_admin';
  const roleLabel = isSuperAdmin ? 'Super Admin' : 'Officer';
  const committeeScopeLabel = isSuperAdmin ? 'All Committees' : (activeOfficer?.assigned_committee || 'Assigned Scope');

  return (
    <>
      {/* Mobile Top Navbar Header */}
      <div className="md:hidden sticky top-0 z-30 w-full bg-[#f4f4f2]/95 dark:bg-[#09090b]/95 backdrop-blur-md border-b border-cso px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/imgs/CSOLOGO.png" alt="CSO Logo" className="w-7 h-7 object-contain" />
          <span className="text-xs font-black text-neutral-900 dark:text-neutral-100 tracking-wider">
            CSO Command Center
          </span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-cso-card border border-cso text-neutral-700 dark:text-neutral-300 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-cso-card border-r border-cso p-6 flex flex-col justify-between shadow-2xl animate-scale-up">
            
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-cso">
                <div className="flex items-center gap-2">
                  <img src="/imgs/CSOLOGO.png" alt="CSO Logo" className="w-8 h-8 object-contain" />
                  <div>
                    <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-100">
                      {activeOfficer?.full_name || 'CSO Admin'}
                    </h3>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                      {roleLabel}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dashboard Overview */}
              <button
                onClick={() => {
                  handleTabSelect('dashboard');
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold ${
                  currentActiveTab === 'dashboard' || currentActiveTab === 'overview'
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md'
                    : 'text-neutral-700 dark:text-neutral-300 bg-[#ebebe8] dark:bg-[#18181b]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-500" />
                Overview & Analytics
              </button>

              {/* Committee Applications */}
              <button
                onClick={() => {
                  handleTabSelect('applications');
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold ${
                  currentActiveTab === 'applications'
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md'
                    : 'text-neutral-700 dark:text-neutral-300 bg-[#ebebe8] dark:bg-[#18181b]'
                }`}
              >
                <Users className="w-4 h-4 text-amber-500" />
                Applicant Records ({committeeScopeLabel})
              </button>

              {/* Officer User Management (Super Admin Only) */}
              {isSuperAdmin && (
                <button
                  onClick={() => {
                    handleTabSelect('officers');
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold ${
                    currentActiveTab === 'officers'
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md'
                      : 'text-neutral-700 dark:text-neutral-300 bg-[#ebebe8] dark:bg-[#18181b]'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-amber-500" />
                  Officer Management
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-cso space-y-3">
              <Link
                href="/"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-[#27272a]"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Public Website
              </Link>

              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="w-4 h-4" /> Admin Logout
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col justify-between shrink-0 bg-cso-card border-r border-cso p-4 relative transition-[width] duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <button
          onClick={toggleCollapse}
          aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="absolute -right-3 top-6 z-20 p-1.5 rounded-full bg-white dark:bg-[#18181b] text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#27272a] border border-neutral-300 dark:border-[#3f3f46] shadow-md transition-transform hover:scale-110"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        <div>
          <div className="flex items-center mb-6 pt-2">
            <div className="w-10 h-10 rounded-lg bg-[#ebebe8] dark:bg-[#18181b] flex items-center justify-center p-1 border border-neutral-300 dark:border-[#27272a] shrink-0 mx-auto md:mx-0">
              <img src="/imgs/CSOLOGO.png" alt="CSO Logo" className="w-full h-full object-contain" />
            </div>
            
            {!collapsed && (
              <div className="ml-3 whitespace-nowrap overflow-hidden">
                <h4 className="font-extrabold text-sm tracking-wide text-neutral-900 dark:text-neutral-100 truncate">
                  {activeOfficer?.full_name || 'CSO Admin'}
                </h4>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {roleLabel}
                </p>
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="mb-6 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <div className="truncate">
                <span className="block text-[9px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-black">Scope:</span>
                <span className="truncate">{committeeScopeLabel}</span>
              </div>
            </div>
          )}

          {/* Sidebar Nav Links */}
          <nav className="space-y-2">
            
            {/* Overview / Dashboard */}
            <button
              onClick={() => handleTabSelect('dashboard')}
              title="Overview & Analytics"
              className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'px-3.5'} py-3 rounded-lg text-xs font-bold text-left ${
                currentActiveTab === 'dashboard' || currentActiveTab === 'overview'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-[#ebebe8] dark:hover:bg-[#18181b]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0 text-amber-500" />
              {!collapsed && <span className="ml-3 truncate">Overview & Analytics</span>}
            </button>

            {/* Committee Applications */}
            <button
              onClick={() => handleTabSelect('applications')}
              title={`Applicant Records (${committeeScopeLabel})`}
              className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'px-3.5'} py-3 rounded-lg text-xs font-bold text-left ${
                currentActiveTab === 'applications'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-[#ebebe8] dark:hover:bg-[#18181b]'
              }`}
            >
              <Users className="w-4 h-4 shrink-0 text-amber-500" />
              {!collapsed && <span className="ml-3 truncate">Applicant Records</span>}
            </button>

            {/* Officer Management (Super Admin Only) */}
            {isSuperAdmin && (
              <button
                onClick={() => handleTabSelect('officers')}
                title="Officer Management"
                className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'px-3.5'} py-3 rounded-lg text-xs font-bold text-left ${
                  currentActiveTab === 'officers'
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-[#ebebe8] dark:hover:bg-[#18181b]'
                }`}
              >
                <UserCheck className="w-4 h-4 shrink-0 text-amber-500" />
                {!collapsed && <span className="ml-3 truncate">Officer Management</span>}
              </button>
            )}

          </nav>
        </div>

        {/* Footer Controls */}
        <div className="pt-6 border-t border-neutral-200 dark:border-[#27272a] space-y-3">
          <Link
            href="/"
            title="Back to Main Website"
            className={`flex items-center ${collapsed ? 'justify-center px-0' : 'px-3.5'} py-2.5 rounded-lg text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-[#ebebe8] dark:hover:bg-[#18181b]`}
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="ml-2.5 truncate">Back to Main Website</span>}
          </Link>

          <button
            onClick={onLogout}
            title="Admin Logout"
            className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'px-3.5'} py-2.5 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="ml-2.5 truncate">Admin Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
