'use client';

import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  Search, 
  Edit3, 
  Save, 
  CheckCircle2,
  Loader2
} from 'lucide-react';
import type { OfficerProfile } from '@/types';
import Modal from '@/components/ui/Modal';

interface OfficerManagementTableProps {
  officers: OfficerProfile[];
  onUpdateOfficer: (id: string, role: 'super_admin' | 'officer', committee: OfficerProfile['assigned_committee']) => Promise<boolean>;
  onRefresh: () => void;
}

export default function OfficerManagementTable({ officers, onUpdateOfficer, onRefresh }: OfficerManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingOfficer, setEditingOfficer] = useState<OfficerProfile | null>(null);
  const [selectedRole, setSelectedRole] = useState<'super_admin' | 'officer'>('officer');
  const [selectedCommittee, setSelectedCommittee] = useState<OfficerProfile['assigned_committee']>('Gaming Committee');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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

  const handleOpenEdit = (officer: OfficerProfile) => {
    setEditingOfficer(officer);
    setSelectedRole(officer.role);
    setSelectedCommittee(officer.assigned_committee);
    setSuccessMsg(null);
  };

  const handleSaveOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfficer) return;

    setSaving(true);
    const success = await onUpdateOfficer(editingOfficer.id, selectedRole, selectedCommittee);

    setSaving(false);
    if (success) {
      setSuccessMsg('Officer role and committee scope updated successfully!');
      setTimeout(() => {
        setEditingOfficer(null);
        onRefresh();
      }, 1200);
    }
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
                      <span className="font-bold text-neutral-900 dark:text-neutral-100 bg-[#ebebe8] dark:bg-[#18181b] px-2.5 py-1 rounded-md border border-cso">
                        {isSuperAdmin ? '🌐 All Committees' : off.assigned_committee}
                      </span>
                    </td>

                    {/* Edit Action Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(off)}
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

      {/* Edit Officer Modal */}
      <Modal
        isOpen={Boolean(editingOfficer)}
        onClose={() => setEditingOfficer(null)}
        title="Edit Officer Permissions & Scope"
      >
        {editingOfficer && (
          <form onSubmit={handleSaveOfficer} className="space-y-5 p-1">
            
            {successMsg ? (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {successMsg}
              </div>
            ) : (
              <>
                {/* Officer Summary Header */}
                <div className="p-3.5 rounded-lg bg-[#f4f4f2] dark:bg-[#121215] border border-cso">
                  <div className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">
                    {editingOfficer.full_name}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                    {editingOfficer.email}
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-xs font-extrabold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    System Role *
                  </label>
                  <select
                    value={selectedRole}
                    onChange={e => {
                      const r = e.target.value as 'super_admin' | 'officer';
                      setSelectedRole(r);
                      if (r === 'super_admin') {
                        setSelectedCommittee('All');
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-cso-input border border-cso text-neutral-900 dark:text-neutral-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    <option value="super_admin">Super Admin (Full Organizational Access)</option>
                    <option value="officer">Committee Officer (Scoped Access)</option>
                  </select>
                </div>

                {/* Assigned Committee Selection */}
                <div>
                  <label className="block text-xs font-extrabold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Assigned Committee Access Scope *
                  </label>
                  <select
                    value={selectedRole === 'super_admin' ? 'All' : selectedCommittee}
                    disabled={selectedRole === 'super_admin'}
                    onChange={e => setSelectedCommittee(e.target.value as OfficerProfile['assigned_committee'])}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-cso-input border border-cso text-neutral-900 dark:text-neutral-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50"
                  >
                    <option value="All">All Committees (Super Admin)</option>
                    <option value="G.A.D Committee">G.A.D Committee (Graphics & Design)</option>
                    <option value="Gaming Committee">Gaming Committee</option>
                    <option value="Networking Committee">Networking Committee</option>
                    <option value="Programming Committee">Programming Committee</option>
                  </select>
                </div>

                {/* Submit Action */}
                <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-cso">
                  <button
                    type="button"
                    onClick={() => setEditingOfficer(null)}
                    className="px-4 py-2.5 rounded-lg bg-neutral-200 dark:bg-[#27272a] text-neutral-800 dark:text-neutral-200 font-bold text-xs uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

          </form>
        )}
      </Modal>

    </div>
  );
}
