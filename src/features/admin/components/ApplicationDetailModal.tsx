'use client';

import React, { useState } from 'react';
import { X, ExternalLink, Calendar, GraduationCap, User, Code, FileText, CheckCircle2, Clock, AlertCircle, Save } from 'lucide-react';
import { ApplicationRecord, updateApplicationStatus, updateAdminNotes } from '../services/adminApi';

interface ApplicationDetailModalProps {
  application: ApplicationRecord | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ApplicationDetailModal({ application, onClose, onUpdate }: ApplicationDetailModalProps) {
  if (!application) return null;

  const [status, setStatus] = useState(application.application_status || 'Pending');
  const [notes, setNotes] = useState(application.admin_notes || '');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);

    await updateApplicationStatus(application.id, status);
    await updateAdminNotes(application.id, notes);

    setSaving(false);
    setSaveSuccess(true);
    onUpdate();

    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  const getStatusBadgeClass = (st: string) => {
    switch (st) {
      case 'Approved':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Contacted':
        return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30';
      case 'Under Review':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Rejected':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      default:
        return 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#fafaf8] dark:bg-[#18181b] border border-[#e0e0da] dark:border-[#27272a] w-full max-w-2xl rounded-xl p-6 sm:p-8 shadow-2xl relative my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-[#27272a] pb-4 mb-6">
          <div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold border ${getStatusBadgeClass(status)}`}>
              {status}
            </span>
            <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-2">
              {application.first_name} {application.middle_name ? `${application.middle_name} ` : ''}{application.last_name}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-1 font-mono">
              <Code className="w-3.5 h-3.5" /> ID: {application.student_id} &bull; Submitted: {new Date(application.created_at).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-lg bg-[#ebebe8] dark:bg-[#27272a] text-neutral-700 dark:text-neutral-200 hover:bg-[#e0e0da] dark:hover:bg-[#3f3f46] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details Grid */}
        <div className="space-y-6 text-xs sm:text-sm">
          
          {/* Contact & Education Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f4f4f2] dark:bg-[#121215] p-4 rounded-lg border border-neutral-300 dark:border-[#27272a]">
            <div>
              <span className="text-[11px] font-extrabold uppercase text-neutral-500 dark:text-neutral-400 block mb-1">
                Program & Year Level
              </span>
              <p className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {application.course_program} &bull; {application.year_level}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase text-neutral-500 dark:text-neutral-400 block mb-1">
                Facebook Profile
              </span>
              <a
                href={application.facebook_link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 truncate"
              >
                Open Student Facebook Profile <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          </div>

          {/* Committee Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <span className="text-[11px] font-extrabold uppercase text-amber-600 dark:text-amber-400 block mb-1">
                Primary Committee Choice
              </span>
              <p className="font-extrabold text-neutral-900 dark:text-neutral-100">
                {application.primary_committee}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-neutral-200 dark:bg-[#27272a] border border-neutral-300 dark:border-[#3f3f46]">
              <span className="text-[11px] font-extrabold uppercase text-neutral-500 dark:text-neutral-400 block mb-1">
                Secondary Committee Choice
              </span>
              <p className="font-bold text-neutral-900 dark:text-neutral-100">
                {application.secondary_committee || 'None'}
              </p>
            </div>
          </div>

          {/* Portfolio Link if provided */}
          {application.portfolio_url && (
            <div className="p-3.5 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-between">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                Student Portfolio / GitHub Link:
              </span>
              <a
                href={application.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-extrabold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                View Portfolio <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Motivation Statement */}
          <div>
            <span className="text-xs font-extrabold uppercase text-neutral-500 dark:text-neutral-400 block mb-1.5 flex items-center gap-1">
              <FileText className="w-4 h-4 text-amber-500" /> Motivation Statement
            </span>
            <div className="p-4 rounded-lg bg-white dark:bg-[#121215] border border-neutral-300 dark:border-[#27272a] text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
              "{application.motivation_statement}"
            </div>
          </div>

          {/* Admin Workflow Editor */}
          <div className="pt-4 border-t border-neutral-200 dark:border-[#27272a] space-y-4">
            <h4 className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100">
              Officer Status & Notes Editor
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-neutral-700 dark:text-neutral-300 mb-1">
                  Application Status
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-[#121215] border border-neutral-300 dark:border-[#27272a] text-neutral-900 dark:text-neutral-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Contacted">Contacted via FB</option>
                  <option value="Approved">Approved Member</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-neutral-700 dark:text-neutral-300 mb-1">
                  Officer Notes (Internal)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Interview scheduled for Tuesday..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-[#121215] border border-neutral-300 dark:border-[#27272a] text-neutral-900 dark:text-neutral-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-2">
              {saveSuccess ? (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Application Status Updated!
                </span>
              ) : (
                <span />
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Updates'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
