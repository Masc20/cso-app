'use client';

import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, LogOut, ArrowLeft, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import Link from 'next/link';

interface AdminSidebarProps {
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminSidebar({ onLogout, activeTab, setActiveTab }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cso_admin_sidebar_collapsed');
      if (stored !== null) {
        setCollapsed(stored === 'true');
      }
    }
  }, []);

  const toggleCollapse = () => {
    setCollapsed(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cso_admin_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

  return (
    <>
      <div className="md:hidden w-full bg-[#fafaf8] dark:bg-[#121215] border-b border-[#e0e0da] dark:border-[#27272a] px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#ebebe8] dark:bg-[#18181b] flex items-center justify-center p-1 border border-neutral-300 dark:border-[#27272a] shrink-0">
            <img src="/imgs/CSOLOGO.png" alt="CSO Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs tracking-wide text-neutral-900 dark:text-neutral-100 leading-none">
              CSO Admin
            </h4>
            <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 mt-0.5">
              <ShieldCheck className="w-2.5 h-2.5" /> Officer Portal
            </p>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(prev => !prev)}
          className="p-2.5 rounded-lg bg-[#ebebe8] dark:bg-[#18181b] text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-[#27272a]"
          title="Toggle Admin Menu"
        >
          {mobileOpen ? <X className="w-5 h-5 text-rose-500" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col">
          {/* Dark Backdrop */}
          <div 
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          />

          {/* Slide Down Menu Drawer */}
          <div className="relative z-10 w-full bg-[#fafaf8] dark:bg-[#121215] border-b border-[#e0e0da] dark:border-[#27272a] p-5 space-y-3 shadow-2xl animate-slide-down">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-[#27272a]">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Admin Navigation
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => {
                setActiveTab('applications');
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold ${
                activeTab === 'applications'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md'
                  : 'text-neutral-700 dark:text-neutral-300 bg-[#ebebe8] dark:bg-[#18181b]'
              }`}
            >
              <Users className="w-4 h-4 text-amber-500" />
              Committee Applications
            </button>

            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-[#ebebe8] dark:bg-[#18181b]"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Main Website
            </Link>

            <button
              onClick={() => {
                setMobileOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20"
            >
              <LogOut className="w-4 h-4" /> Admin Logout
            </button>
          </div>
        </div>
      )}

      <aside
        className={`hidden md:flex flex-col justify-between shrink-0 bg-[#fafaf8] dark:bg-[#121215] border-r border-[#e0e0da] dark:border-[#27272a] p-4 relative transition-[width] duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        
        {/* Floating Border Toggle Button */}
        <button
          onClick={toggleCollapse}
          aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="absolute -right-3 top-6 z-20 p-1.5 rounded-full bg-white dark:bg-[#18181b] text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#27272a] border border-neutral-300 dark:border-[#3f3f46] shadow-md transition-transform hover:scale-110"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Top Header Section */}
        <div>
          <div className="flex items-center mb-8 pt-2">
            
            {/* CSO Logo Image*/}
            <div className="w-10 h-10 rounded-lg bg-[#ebebe8] dark:bg-[#18181b] flex items-center justify-center p-1 border border-neutral-300 dark:border-[#27272a] shrink-0 mx-auto md:mx-0">
              <img src="/imgs/CSOLOGO.png" alt="CSO Logo" className="w-full h-full object-contain" />
            </div>
            
            {/* Text details */}
            {!collapsed && (
              <div className="ml-3 whitespace-nowrap overflow-hidden">
                <h4 className="font-extrabold text-sm tracking-wide text-neutral-900 dark:text-neutral-100">
                  CSO Admin
                </h4>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Officer Portal
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Nav Links */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('applications')}
              title="Committee Applications"
              className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'px-3.5'} py-3 rounded-lg text-xs font-bold text-left ${
                activeTab === 'applications'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-[#ebebe8] dark:hover:bg-[#18181b]'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="ml-3 truncate">Committee Applications</span>}
            </button>
          </nav>
        </div>

        {/* Footer Controls */}
        <div className="pt-6 border-t border-neutral-200 dark:border-[#27272a] space-y-3">
          
          {/* Back to Public Web Site */}
          <Link
            href="/"
            title="Back to Main Website"
            className={`flex items-center ${collapsed ? 'justify-center px-0' : 'px-3.5'} py-2.5 rounded-lg text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-[#ebebe8] dark:hover:bg-[#18181b]`}
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="ml-2.5 truncate">Back to Main Website</span>}
          </Link>

          {/* Logout Button */}
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
