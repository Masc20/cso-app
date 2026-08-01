'use client';

import React from 'react';
import { Users, Clock, CheckCircle2, Award } from 'lucide-react';
import { ApplicationRecord } from '../services/adminApi';

interface MetricCardsProps {
  applications: ApplicationRecord[];
}

export default function MetricCards({ applications }: MetricCardsProps) {
  const total = applications.length;
  const pending = applications.filter(a => (a.application_status || 'Pending') === 'Pending').length;
  const approved = applications.filter(a => a.application_status === 'Approved').length;

  // Calculate top committee
  const committeeCounts: Record<string, number> = {};
  applications.forEach(a => {
    committeeCounts[a.primary_committee] = (committeeCounts[a.primary_committee] || 0) + 1;
  });

  let topCommittee = 'Programming';
  let maxCount = 0;
  Object.entries(committeeCounts).forEach(([comm, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topCommittee = comm.replace(' Committee', '');
    }
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      
      {/* Card 1: Total Applications */}
      <div className="bg-[#fafaf8] dark:bg-[#18181b] border border-[#e0e0da] dark:border-[#27272a] rounded-2xl p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Total Applicants
            </p>
            <h4 className="text-3xl font-black text-neutral-900 dark:text-neutral-100 mt-1">
              {total}
            </h4>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Card 2: Pending Reviews */}
      <div className="bg-[#fafaf8] dark:bg-[#18181b] border border-[#e0e0da] dark:border-[#27272a] rounded-2xl p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Pending Review
            </p>
            <h4 className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {pending}
            </h4>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Card 3: Approved Applicants */}
      <div className="bg-[#fafaf8] dark:bg-[#18181b] border border-[#e0e0da] dark:border-[#27272a] rounded-2xl p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Approved Members
            </p>
            <h4 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {approved}
            </h4>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Card 4: Top Preferred Committee */}
      <div className="bg-[#fafaf8] dark:bg-[#18181b] border border-[#e0e0da] dark:border-[#27272a] rounded-2xl p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Top Preferred Division
            </p>
            <h4 className="text-xl font-black text-neutral-900 dark:text-neutral-100 mt-1 truncate max-w-[150px]">
              {topCommittee}
            </h4>
          </div>
          <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-500/20 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

    </div>
  );
}
