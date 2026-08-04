'use client';

import React from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  Lock, 
  Unlock, 
  PieChart, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import type { AdminDashboardOverviewProps } from '../types';
import { COMMITTEE_OPTIONS } from '@/data';
import { calculateCommitteeCounts, calculateTopCommittee } from '@/lib/utils';

export default function AdminDashboardOverview({
  applications,
  isRegistrationOpen,
  onToggleRegistration,
  toggling,
  profile,
  onNavigateToApplications
}: AdminDashboardOverviewProps) {
  const isSuperAdmin = !profile || profile.role === 'super_admin';

  // Global Metrics across all applications
  const totalApps = applications.length;
  const pendingApps = applications.filter(a => (a.application_status || 'Pending') === 'Pending').length;
  const approvedApps = applications.filter(a => a.application_status === 'Approved').length;

  // Centralized analytics helpers
  const committeeCounts = calculateCommitteeCounts(applications);
  const topCommittee = calculateTopCommittee(committeeCounts);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Executive Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Total Applicants */}
        <div className="bg-cso-card border border-cso rounded-xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl gpu-accelerated">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Total Applicants
              </p>
              <h4 className="text-3xl font-black text-neutral-900 dark:text-neutral-100 mt-1">
                {totalApps}
              </h4>
            </div>
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 2: Pending Reviews */}
        <div className="bg-cso-card border border-cso rounded-xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl gpu-accelerated">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Pending Review
              </p>
              <h4 className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {pendingApps}
              </h4>
            </div>
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 3: Approved Members */}
        <div className="bg-cso-card border border-cso rounded-xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl gpu-accelerated">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Approved Members
              </p>
              <h4 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {approvedApps}
              </h4>
            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 4: Top Choice Committee */}
        <div className="bg-cso-card border border-cso rounded-xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl gpu-accelerated">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Top Choice Committee
              </p>
              <h4 className="text-xl font-black text-neutral-900 dark:text-neutral-100 mt-1 truncate max-w-[150px]">
                {topCommittee}
              </h4>
            </div>
            <div className="w-12 h-12 rounded-lg bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-500/20 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

      </div>

      {/* 2. Committee Distribution Breakdown & Portal Gate Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Spans): Committee Distribution Progress Bars */}
        <div className="lg:col-span-2 bg-cso-card border border-cso rounded-xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-black text-neutral-900 dark:text-neutral-100">
                  Committee Applicant Demand Distribution
                </h3>
              </div>
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                Global Statistics ({totalApps} total)
              </span>
            </div>

            {/* Distribution Progress Items */}
            <div className="space-y-4 pt-2">
              {COMMITTEE_OPTIONS.map((comm) => {
                const count = committeeCounts[comm.id] || 0;
                const percentage = totalApps > 0 ? Math.round((count / totalApps) * 100) : 0;

                return (
                  <div key={comm.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        {comm.label}
                      </span>
                      <span className="text-neutral-600 dark:text-neutral-400 font-mono">
                        {count} applicants ({percentage}%)
                      </span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full h-3 rounded-full bg-[#ebebe8] dark:bg-[#27272a] overflow-hidden p-0.5 border border-cso">
                      <div
                        style={{ width: `${percentage}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-cso flex items-center justify-between">
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Want to manage committee records?
            </p>
            <button
              onClick={onNavigateToApplications}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-extrabold uppercase tracking-wider hover:opacity-90 transition-transform active:scale-95 min-h-[36px]"
            >
              View Applicant Records <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column (1 Span): Portal Gate & Security Controls */}
        <div className="bg-cso-card border border-cso rounded-xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-black text-neutral-900 dark:text-neutral-100">
                Recruitment Portal Gate
              </h3>
            </div>

            {/* Current Gate Status Badge */}
            <div className={`p-4 rounded-xl border flex items-center gap-3 ${
              isRegistrationOpen
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
            }`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                isRegistrationOpen ? 'bg-emerald-500/20' : 'bg-rose-500/20'
              }`}>
                {isRegistrationOpen ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider block">
                  Status: {isRegistrationOpen ? 'OPEN' : 'CLOSED'}
                </span>
                <span className="text-[11px] font-medium opacity-90 block">
                  {isRegistrationOpen
                    ? 'Students can currently register on the main portal.'
                    : 'The registration portal is locked.'}
                </span>
              </div>
            </div>

            {/* Gate Toggle Action Button (Super Admin Only) */}
            {isSuperAdmin ? (
              <button
                onClick={onToggleRegistration}
                disabled={toggling}
                className={`w-full py-3 px-4 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md border min-h-[36px] ${
                  isRegistrationOpen
                    ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500/50'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500/50'
                }`}
              >
                {isRegistrationOpen ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                {toggling ? 'Updating Portal...' : isRegistrationOpen ? 'Close Portal Gate' : 'Open Portal Gate'}
              </button>
            ) : (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Only Super Admin officers can open or close the registration gate.</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-cso text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            <span className="font-bold text-neutral-800 dark:text-neutral-200">Logged Officer: </span>
            {profile?.full_name || 'CSO Officer'} ({isSuperAdmin ? 'Super Admin' : profile?.assigned_committee})
          </div>

        </div>

      </div>

    </div>
  );
}
