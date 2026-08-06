'use client';

import { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  Search, 
  Edit3 
} from 'lucide-react';
import type { OfficerProfile, OfficerManagementTableProps } from '@/types';
import { EditOfficerModal } from '@/components/modals';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '@/components/ui';
import { getCommitteeBadgeClass } from '@/lib/utils';

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
            <UserCheck className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
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
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-cso-input border border-cso text-neutral-900 dark:text-neutral-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-neutral-400/50"
          />
        </div>
      </div>

      {/* Centralized Table Component */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Officer Name & Email</TableHead>
            <TableHead>System Role</TableHead>
            <TableHead>Assigned Committee Access</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOfficers.length === 0 ? (
            <TableEmpty colSpan={4} message="No officer accounts registered yet." />
          ) : (
            filteredOfficers.map((off) => {
              const isSuperAdmin = off.role === 'super_admin';

              return (
                <TableRow key={off.id}>
                  
                  {/* Name & Email */}
                  <TableCell>
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">
                      {off.full_name}
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                      {off.email}
                    </div>
                  </TableCell>

                  {/* Role Badge */}
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                      isSuperAdmin
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/30'
                    }`}>
                      <ShieldCheck className="w-3 h-3" />
                      {isSuperAdmin ? 'Super Admin' : 'Committee Officer'}
                    </span>
                  </TableCell>

                  {/* Assigned Committee Badge */}
                  <TableCell>
                    {isSuperAdmin ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-extrabold border bg-neutral-200/60 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 border-cso">
                        🌐 All Committees
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-extrabold border ${getCommitteeBadgeClass(off.assigned_committee)}`}>
                        {off.assigned_committee}
                      </span>
                    )}
                  </TableCell>

                  {/* Edit Action Button */}
                  <TableCell className="text-right">
                    <button
                      onClick={() => setEditingOfficer(off)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900 font-extrabold text-[11px] uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Scope
                    </button>
                  </TableCell>

                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Extracted Edit Officer Modal Component */}
      <EditOfficerModal
        isOpen={Boolean(editingOfficer)}
        officer={editingOfficer}
        onClose={() => setEditingOfficer(null)}
        onSave={handleSaveOfficer}
      />

    </div>
  );
}
