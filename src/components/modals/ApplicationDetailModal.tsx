'use client';

import React, { useState, useEffect } from 'react';
import { User, GraduationCap, Calendar, Clock, Link as LinkIcon, ExternalLink, FileText, CheckCircle2, XCircle, Clock3, Sparkles, AlertCircle } from 'lucide-react';
import type { ApplicationDetailModalProps } from '@/types';
import Modal from './Modal';
import { getStatusBadgeClass } from '@/lib/utils';

export default function ApplicationDetailModal({
  isOpen,
  onClose,
  application,
  onSaveNotes,
  onUpdateStatus,
  onUpdate
}: ApplicationDetailModalProps) {
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Pending');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (application) {
      setNotes(application.admin_notes || '');
      setStatus(application.application_status || 'Pending');
      setSaveSuccess(false);
    }
  }, [application]);

  if (!application) return null;

  const handleSave = () => {
    setIsSaving(true);
    if (onSaveNotes) onSaveNotes(application.id, notes);
    if (onUpdateStatus) onUpdateStatus(application.id, status);
    if (onUpdate) onUpdate(application.id, status, notes);
    
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 300);
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case 'Approved':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Interview Scheduled':
      case 'Contacted':
        return <Clock3 className="w-3.5 h-3.5 text-sky-500" />;
      case 'Rejected':
        return <XCircle className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  const portfolioUrl = application.portfolioUrl || application.portfolio_url;

  return (
    <Modal isOpen={Boolean(isOpen)} onClose={onClose} title="Applicant Application File" className="max-w-3xl">
      <div className="space-y-6">
        
        {/* Header Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-cso-input border border-cso">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black text-lg flex items-center justify-center border border-amber-500/30">
              {application.first_name[0]}{application.last_name[0]}
            </div>
            <div>
              <h4 className="text-lg font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                {application.first_name} {application.middle_name ? `${application.middle_name} ` : ''}{application.last_name}
              </h4>
              <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                ID: {application.student_id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold border ${getStatusBadgeClass(status)}`}>
              {getStatusIcon(status)} {status}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-cso-input border border-cso space-y-1">
            <span className="text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-amber-500" /> Program & Year Level
            </span>
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {application.course_program} &bull; {application.year_level}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-cso-input border border-cso space-y-1">
            <span className="text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Committee Preferences
            </span>
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              1st: <span className="text-amber-600 dark:text-amber-400">{application.primary_committee}</span>
              {application.secondary_committee && application.secondary_committee !== 'None' && (
                <span className="text-neutral-500 font-normal"> | 2nd: {application.secondary_committee}</span>
              )}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-cso-input border border-cso space-y-1">
            <span className="text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-sky-500" /> Facebook Profile Link
            </span>
            {application.facebook_link ? (
              <a
                href={application.facebook_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 truncate max-w-full"
              >
                View FB Profile <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <p className="text-xs text-neutral-400 font-medium">Not provided</p>
            )}
          </div>

          <div className="p-3.5 rounded-lg bg-cso-input border border-cso space-y-1">
            <span className="text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-emerald-500" /> Portfolio / GitHub
            </span>
            {portfolioUrl ? (
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 truncate max-w-full"
              >
                View Portfolio <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <p className="text-xs text-neutral-400 font-medium">None provided</p>
            )}
          </div>
        </div>

        {/* Motivation Statement */}
        <div className="space-y-1.5">
          <label className="text-xs font-extrabold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
            <FileText className="w-4 h-4 text-amber-500" /> Motivation Statement
          </label>
          <div className="p-4 rounded-xl bg-cso-input border border-cso text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium max-h-36 overflow-y-auto">
            {application.motivation_statement}
          </div>
        </div>

        {/* Officer Status Selector & Internal Notes */}
        <div className="pt-4 border-t border-cso space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                Application Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full rounded-lg bg-cso-input border border-cso px-3 py-2 text-xs font-bold text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Pending">Pending Review</option>
                <option value="Interview Scheduled">Interview Scheduled / Contacted</option>
                <option value="Approved">Approved / Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-2.5 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                {isSaving ? 'Saving...' : saveSuccess ? 'Saved ✓' : 'Save Status & Notes'}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
              Internal Officer Notes (Private)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add private evaluation notes or interview comments for this applicant..."
              className="w-full rounded-lg bg-cso-input border border-cso p-3 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

      </div>
    </Modal>
  );
}
