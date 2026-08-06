'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink, GraduationCap, Code, FileText, CheckCircle2, Save } from 'lucide-react';
import type { ApplicationDetailModalProps } from '@/types';
import { updateApplicationStatus, updateAdminNotes } from '@/features/admin';
import { Modal } from '@/components/ui';
import { sanitizeString, getStatusBadgeClass } from '@/lib/utils';
import { APPLICATION_STATUS_MUTATION_OPTIONS } from '@/data';

export default function ApplicationDetailModal({ application, onClose, onUpdate }: ApplicationDetailModalProps) {
  const [status, setStatus] = useState(application?.application_status || 'Pending');
  const [notes, setNotes] = useState(application?.admin_notes || '');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (application) {
      setStatus(application.application_status || 'Pending');
      setNotes(application.admin_notes || '');
    }
  }, [application]);

  if (!application) return null;

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);

    const cleanNotes = sanitizeString(notes);

    await updateApplicationStatus(application.id, status);
    await updateAdminNotes(application.id, cleanNotes);

    setSaving(false);
    setSaveSuccess(true);
    onUpdate?.(application.id, status, cleanNotes);

    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  return (
    <Modal 
      isOpen={!!application} 
      onClose={onClose} 
      className="max-w-2xl sm:max-w-3xl"
    >
      
      {/* Fixed Header Bar */}
      <div className="shrink-0 flex items-start justify-between border-b border-cso pb-3.5 mb-4">
        <div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-bold border ${getStatusBadgeClass(status)}`}>
            {status}
          </span>
          <h3 className="text-lg sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-1.5 leading-tight">
            {application.first_name} {application.middle_name ? `${application.middle_name} ` : ''}{application.last_name}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-mono">
            <span className="flex items-center gap-1">
              <Code className="w-3.5 h-3.5" /> ID: {application.student_id}
            </span>
            <span>&bull; Submitted: {new Date(application.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-cso-input border border-cso text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-[#3f3f46] transition-colors shrink-0 ml-2"
          title="Close Modal (Esc or Click Outside)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs sm:text-sm min-h-0">
        
        {/* Contact & Education Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#f4f4f2] dark:bg-[#121215] p-3.5 rounded-lg border border-cso">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-neutral-500 dark:text-neutral-400 block mb-1">
              Program & Year Level
            </span>
            <p className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              {application.course_program} &bull; {application.year_level}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase text-neutral-500 dark:text-neutral-400 block mb-1">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400 block mb-1">
              Primary Committee Choice
            </span>
            <p className="font-extrabold text-neutral-900 dark:text-neutral-100">
              {application.primary_committee}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-cso-input border border-cso">
            <span className="text-[10px] font-extrabold uppercase text-neutral-500 dark:text-neutral-400 block mb-1">
              Secondary Committee Choice
            </span>
            <p className="font-bold text-neutral-900 dark:text-neutral-100">
              {application.secondary_committee || 'None'}
            </p>
          </div>
        </div>

        {/* Portfolio Link if provided */}
        {application.portfolio_url && (
          <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
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
          <span className="text-xs font-extrabold uppercase text-neutral-500 dark:text-neutral-400 block mb-1 flex items-center gap-1">
            <FileText className="w-4 h-4 text-amber-500 shrink-0" /> Motivation Statement
          </span>
          <div className="p-3.5 rounded-lg bg-white dark:bg-[#121215] border border-cso text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium max-h-48 sm:max-h-64 overflow-y-auto whitespace-pre-wrap">
            "{application.motivation_statement}"
          </div>
        </div>

        {/* Admin Workflow Editor */}
        <div className="pt-3 border-t border-cso space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
            Officer Status & Notes Editor
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-neutral-700 dark:text-neutral-300 mb-1">
                Application Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-cso-input border border-cso text-neutral-900 dark:text-neutral-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                {APPLICATION_STATUS_MUTATION_OPTIONS.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
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
                maxLength={500}
                className="w-full px-3.5 py-2.5 rounded-lg bg-cso-input border border-cso text-neutral-900 dark:text-neutral-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Fixed Footer Bar */}
      <div className="shrink-0 pt-3 mt-3 border-t border-cso flex items-center justify-between">
        {saveSuccess ? (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Updated!
          </span>
        ) : (
          <span />
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50 ml-auto"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Updates'}
        </button>
      </div>

    </Modal>
  );
}
