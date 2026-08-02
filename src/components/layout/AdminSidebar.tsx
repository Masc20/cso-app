'use client';

import React from 'react';
import { LayoutDashboard, Users, ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AdminSidebarProps {
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminSidebar({ onLogout, activeTab, setActiveTab }: AdminSidebarProps) {
  return (
    <aside className="w-full md:w-64 bg-[#fafaf8] dark:bg-[#121215] border-r border-[#e0e0da] dark:border-[#27272a] p-6 flex flex-col justify-between shrink-0 transition-colors">
      
      <div>
        {/* Brand Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-[#ebebe8] dark:bg-[#18181b] flex items-center justify-center p-1 border border-neutral-300 dark:border-[#27272a]">
            <img src="/imgs/CSOLOGO.png" alt="CSO Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm tracking-wide text-neutral-900 dark:text-neutral-100">
              CSO Admin
            </h4>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Officer Portal
            </p>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('applications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-colors text-left ${
              activeTab === 'applications'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-md'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-[#ebebe8] dark:hover:bg-[#18181b]'
            }`}
          >
            <Users className="w-4 h-4" />
            Committee Applications
          </button>
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="pt-6 border-t border-neutral-200 dark:border-[#27272a] space-y-3">
        {/* Back to Public Web Site */}
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-[#ebebe8] dark:hover:bg-[#18181b] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Main Website
        </Link>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Admin Logout
        </button>
      </div>

    </aside>
  );
}
