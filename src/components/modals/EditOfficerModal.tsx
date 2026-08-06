'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, UserCheck, CheckCircle2, Save } from 'lucide-react';
import type { EditOfficerModalProps, OfficerProfile } from '@/types';
import { getCommitteeBadgeClass, getCommitteeTextColorClass } from '@/lib/utils';
import Modal from '../ui/Modal';

export default function EditOfficerModal({
  isOpen,
  onClose,
  officer,
  onSave
}: EditOfficerModalProps) {
  const [role, setRole] = useState<'super_admin' | 'officer'>('officer');
  const [committee, setCommittee] = useState('All');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (officer) {
      setRole(officer.role);
      setCommittee(officer.assigned_committee);
      setSaveSuccess(false);
    }
  }, [officer]);

  if (!officer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(officer.id, role, committee as OfficerProfile['assigned_committee']);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <Modal isOpen={Boolean(isOpen)} onClose={onClose} className="max-w-md">
      <form onSubmit={handleSubmit} className="h-full flex flex-col min-h-0">
        
        {/* Fixed Header Bar */}
        <div className="shrink-0 flex items-start justify-between border-b border-cso pb-3.5 mb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-bold border bg-neutral-200/60 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 border-cso">
              <ShieldCheck className="w-3.5 h-3.5" /> Security & Role Settings
            </span>
            <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-neutral-100 mt-1.5 leading-tight">
              Edit Officer Access Scope
            </h3>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-mono">
              <span>{officer.full_name}</span> &bull; <span>{officer.email}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-cso-input border border-cso text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-[#3f3f46] transition-colors shrink-0 ml-2"
            title="Close Modal (Esc or Click Outside)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs sm:text-sm min-h-0">
          
          {/* Officer Summary Badge */}
          <div className="p-3.5 rounded-lg bg-[#f4f4f2] dark:bg-[#121215] border border-cso space-y-1">
            <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-neutral-500 shrink-0" /> {officer.full_name}
            </p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
              Account Email: {officer.email}
            </p>
          </div>

          {/* Role Selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block">
              System Permission Role
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as 'super_admin' | 'officer')}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-neutral-400 transition-colors ${
                role === 'super_admin'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/30'
              }`}
            >
              <option value="officer" className="bg-[#f4f4f2] dark:bg-[#18181b] text-neutral-800 dark:text-neutral-200 font-bold">Officer (Committee Scope Locked)</option>
              <option value="super_admin" className="bg-[#f4f4f2] dark:bg-[#18181b] text-emerald-600 dark:text-emerald-400 font-bold">Super Admin (Full Unrestricted Access)</option>
            </select>
          </div>

          {/* Assigned Committee Scope Selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block">
              Assigned Committee Access Scope
            </label>
            <select
              value={committee}
              onChange={e => setCommittee(e.target.value)}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-neutral-400 transition-colors ${
                committee !== 'All' 
                  ? getCommitteeBadgeClass(committee)
                  : 'bg-cso-input border-cso text-neutral-900 dark:text-neutral-100'
              }`}
            >
              <option value="All" className="bg-[#f4f4f2] dark:bg-[#18181b] text-neutral-900 dark:text-neutral-100 font-bold">All Committees (Unrestricted)</option>
              <option value="G.A.D Committee" className={`bg-[#f4f4f2] dark:bg-[#18181b] ${getCommitteeTextColorClass('G.A.D')}`}>G.A.D Committee</option>
              <option value="Gaming Committee" className={`bg-[#f4f4f2] dark:bg-[#18181b] ${getCommitteeTextColorClass('Gaming')}`}>Gaming Committee</option>
              <option value="Networking Committee" className={`bg-[#f4f4f2] dark:bg-[#18181b] ${getCommitteeTextColorClass('Networking')}`}>Networking Committee</option>
              <option value="Programming Committee" className={`bg-[#f4f4f2] dark:bg-[#18181b] ${getCommitteeTextColorClass('Programming')}`}>Programming Committee</option>
            </select>
          </div>

        </div>

        {/* Fixed Footer Bar */}
        <div className="shrink-0 pt-3 mt-3 border-t border-cso flex items-center justify-between">
          {saveSuccess ? (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Permissions Saved!
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md ml-auto"
          >
            <Save className="w-4 h-4" /> Save Permissions
          </button>
        </div>

      </form>
    </Modal>
  );
}
