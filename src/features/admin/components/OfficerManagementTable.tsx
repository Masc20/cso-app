'use client';

import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  Search, 
  Edit3 
} from 'lucide-react';
import type { OfficerProfile } from '@/types';
import EditOfficerModal from '../modals/EditOfficerModal';

interface OfficerManagementTableProps {
  officers: OfficerProfile[];
  onUpdateOfficer: (id: string, role: 'super_admin' | 'officer', committee: OfficerProfile['assigned_committee']) => Promise<boolean>;
  onRefresh: () => void;
}

export default function OfficerManagementTable({ officers, onUpdateOfficer, onRefresh }: OfficerManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingOfficer, setEditingOfficer] = useState<OfficerProfile | null>(null);

  // Filter officers based on search term
  const filteredOfficers = officers.filter(off => {
    const term = searchTerm.toLowerCase();
    return (
      off.full_name.toLowerCase().includes(term) ||
      off.email.toLowerCase().includes(term) ||
      off.assigned_committee.toLowerCase().includes(term) ||
      off.role.toLowerCase().includes(term)
    );
  });

  const handleSaveOfficer = async (
    id: string,
    role: 'super_admin' | 'officer',
    committee: OfficerProfile['assigned_committee']
  ) => {
    const success = await onUpdateOfficer(id, role, committee);
    if (success) {
      onRefresh();
    }
    return success;
  };

  return (
    <div className="bg-cso-card border border-cso rounded-xl p-4 sm:p-6 shadow-xl space-y-6 animate-fade-in">
      
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-500" />
            CSO Officer Account & Permission Management
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
            Manage officer permissions, assign committee access scopes, and grant Super Admin privileges.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search officer name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-cso-input border border-cso text-neutral-900 dark:text-neutral-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
      </div>

      {/* Officers Table Container */}
      <div className="overflow-x-auto rounded-lg border border-cso relative">
        <table className="w-full min-w-[650px] text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#f4f4f2] dark:bg-[#121215] border-b border-cso text-neutral-500 dark:text-neutral-400 font-extrabold uppercase tracking-wider">
              <th className="py-3.5 px-4">Officer Name & Email</th>
              <th className="py-3.5 px-4">System Role</th>
              <th className="py-3.5 px-4">Assigned Committee Access</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-[#27272a] font-medium text-neutral-800 dark:text-neutral-200">
            {filteredOfficers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-neutral-500 dark:text-neutral-400 font-bold">
                  No officer accounts registered yet.
                </td>
              </tr>
            ) : (
              filteredOfficers.map((off) => {
                const isSuperAdmin = off.role === 'super_admin';

                return (
                  <tr key={off.id} className="hover:bg-[#f0f0eb] dark:hover:bg-[#1f1f23]">
                    
                    {/* Name & Email */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900 dark:text-neutral-100">
                        {off.full_name}
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                        {off.email}
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                        isSuperAdmin
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        {isSuperAdmin ? 'Super Admin' : 'Committee Officer'}
                      </span>
                    </td>

                    {/* Assigned Committee */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100 bg-cso-input px-2.5 py-1 rounded-md border border-cso">
                        {isSuperAdmin ? '🌐 All Committees' : off.assigned_committee}
                      </span>
                    </td>

                    {/* Edit Action Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setEditingOfficer(off)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-[#27272a] dark:hover:bg-[#3f3f46] dark:text-neutral-100 font-extrabold text-[11px] uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-400" /> Edit Scope
                      </button>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Extracted Edit Officer Modal Component */}
      <EditOfficerModal
        officer={editingOfficer}
        onClose={() => setEditingOfficer(null)}
        onSave={handleSaveOfficer}
      />

    </div>
  );
}
