'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Loader2 } from 'lucide-react';
import type { OfficerProfile } from '@/types';
import type { EditOfficerModalProps } from '../types';
import { Modal } from '@/components/ui';
import { OFFICER_ROLE_OPTIONS, COMMITTEE_OPTIONS } from '@/data';

export default function EditOfficerModal({ officer, onClose, onSave }: EditOfficerModalProps) {
  const [selectedRole, setSelectedRole] = useState<'super_admin' | 'officer'>('officer');
  const [selectedCommittee, setSelectedCommittee] = useState<OfficerProfile['assigned_committee']>('Gaming Committee');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (officer) {
      setSelectedRole(officer.role);
      setSelectedCommittee(officer.assigned_committee);
      setSuccessMsg(null);
    }
  }, [officer]);

  if (!officer) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const success = await onSave(officer.id, selectedRole, selectedCommittee);
    setSaving(false);

    if (success) {
      setSuccessMsg('Officer permissions updated successfully!');
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  return (
    <Modal
      isOpen={Boolean(officer)}
      onClose={onClose}
      title="Edit Officer Permissions & Scope"
    >
      <form onSubmit={handleSave} className="space-y-5 p-1">
        
        {successMsg ? (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {successMsg}
          </div>
        ) : (
          <>
            {/* Officer Summary Header */}
            <div className="p-3.5 rounded-lg bg-cso-input border border-cso">
              <div className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">
                {officer.full_name}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                {officer.email}
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
                {OFFICER_ROLE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
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
                {COMMITTEE_OPTIONS.map(comm => (
                  <option key={comm.id} value={comm.id}>{comm.label}</option>
                ))}
              </select>
            </div>

            {/* Submit Action */}
            <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-cso">
              <button
                type="button"
                onClick={onClose}
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
    </Modal>
  );
}
