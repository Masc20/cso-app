'use client';

import React from 'react';
import { Users, Clock, CheckCircle2, Award } from 'lucide-react';
import type { MetricCardsProps } from '@/types';
import { calculateCommitteeCounts, calculateTopCommittee } from '@/lib/utils';

export default function MetricCards({ applications }: MetricCardsProps) {
  const totalApps = applications.length;
  const pendingApps = applications.filter(a => (a.application_status || 'Pending') === 'Pending').length;
  const approvedApps = applications.filter(a => a.application_status === 'Approved').length;

  const committeeCounts = calculateCommitteeCounts(applications);
  const topCommittee = calculateTopCommittee(committeeCounts);

  const metrics = [
    {
      title: 'Total Applications',
      value: totalApps,
      icon: Users,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    },
    {
      title: 'Pending Review',
      value: pendingApps,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    },
    {
      title: 'Approved Members',
      value: approvedApps,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: 'Top Choice Committee',
      value: topCommittee,
      icon: Award,
      color: 'text-fuchsia-500',
      bgColor: 'bg-fuchsia-500/10',
      borderColor: 'border-fuchsia-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {metrics.map((m, idx) => {
        const IconComponent = m.icon;
        return (
          <div
            key={idx}
            className="bg-cso-card border border-cso rounded-xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl gpu-accelerated"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  {m.title}
                </p>
                <h4 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 mt-1 truncate max-w-[150px]">
                  {m.value}
                </h4>
              </div>

              <div className={`w-12 h-12 rounded-lg ${m.bgColor} ${m.color} border ${m.borderColor} flex items-center justify-center shrink-0`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
