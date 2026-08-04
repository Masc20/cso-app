'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, Lock, AlertCircle } from 'lucide-react';
import type { EditOfficerModalProps, OfficerProfile } from '@/types';
import Modal from './Modal';

export default function EditOfficerModal({
  isOpen,
  onClose,
  officer,
  onSave
}: EditOfficerModalProps) {
  const [role, setRole] = useState<'super_admin' | 'officer'>('officer');
  const [committee, setCommittee] = useState('All');

  useEffect(() => {
    if (officer) {
      setRole(officer.role);
      setCommittee(officer.assigned_committee);
    }
  }, [officer]);

  if (!officer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(officer.id, role, committee as OfficerProfile['assigned_committee']);
    onClose();
  };

  return (
    <Modal isOpen={Boolean(isOpen)} onClose={onClose} title="Edit Officer Role & Access Scope" className="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Officer Summary */}
        <div className="p-3.5 rounded-lg bg-cso-input border border-cso space-y-1">
          <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-amber-500" /> {officer.full_name}
          </p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
            {officer.email}
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
            className="w-full rounded-lg bg-cso-input border border-cso px-3 py-2.5 text-xs font-bold text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="officer">Officer (Committee Locked)</option>
            <option value="super_admin">Super Admin (Full Portal Access)</option>
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
            className="w-full rounded-lg bg-cso-input border border-cso px-3 py-2.5 text-xs font-bold text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="All">All Committees (Unrestricted)</option>
            <option value="G.A.D Committee">G.A.D Committee</option>
            <option value="Gaming Committee">Gaming Committee</option>
            <option value="Networking Committee">Networking Committee</option>
            <option value="Programming Committee">Programming Committee</option>
          </select>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-cso">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-cso text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-[#27272a] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" /> Save Permissions
          </button>
        </div>

      </form>
    </Modal>
  );
}
