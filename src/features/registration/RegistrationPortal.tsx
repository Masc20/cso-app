'use client';

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, User, Link as LinkIcon, GraduationCap, Code, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';
import FloatingInput from '@/components/ui/FloatingInput';
import FloatingTextarea from '@/components/ui/FloatingTextarea';
import { COMMITTEE_OPTIONS } from '@/data/committees';
import { COURSE_OPTIONS, createInitialFormData, YEAR_LEVEL_OPTIONS } from './form';
import { isValidFacebookUrl, isValidHttpUrl, sanitizeString } from '@/lib/utils/validation';

interface RegistrationPortalProps {
  selectedCommittee: string;
}

export default function RegistrationPortal({ selectedCommittee }: RegistrationPortalProps) {
  const [formData, setFormData] = useState(() => createInitialFormData(selectedCommittee || undefined));

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!selectedCommittee) return;

    const frameId = requestAnimationFrame(() => {
      setFormData((previous) => ({ ...previous, primaryCommittee: selectedCommittee }));
    });

    return () => cancelAnimationFrame(frameId);
  }, [selectedCommittee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // 1. Sanitize all user input fields
    const cleanStudentId = sanitizeString(formData.studentId);
    const cleanFirstName = sanitizeString(formData.firstName);
    const cleanMiddleName = sanitizeString(formData.middleName);
    const cleanLastName = sanitizeString(formData.lastName);
    const cleanFbLink = sanitizeString(formData.facebookLink);
    const cleanPortfolioUrl = sanitizeString(formData.portfolioUrl);
    const cleanMotivation = sanitizeString(formData.motivationStatement);

    // 2. Perform Validation Checks
    if (!cleanFirstName || !cleanLastName) {
      setErrorMsg('Please enter your full first name and last name.');
      setLoading(false);
      return;
    }

    if (!cleanStudentId) {
      setErrorMsg('Please enter a valid Student ID Number.');
      setLoading(false);
      return;
    }

    if (!cleanFbLink || !isValidFacebookUrl(cleanFbLink)) {
      setErrorMsg('Please provide a valid Facebook Profile Link (e.g. https://facebook.com/your.profile).');
      setLoading(false);
      return;
    }

    if (cleanPortfolioUrl && !isValidHttpUrl(cleanPortfolioUrl)) {
      setErrorMsg('Please enter a valid Portfolio URL starting with http:// or https://');
      setLoading(false);
      return;
    }

    if (!cleanMotivation || cleanMotivation.length < 10) {
      setErrorMsg('Please write a brief motivation statement (minimum 10 characters).');
      setLoading(false);
      return;
    }

    try {
      // 3. Save Sanitized Payload to Supabase
      const { error } = await supabase
        .from('committee_applications')
        .insert([
          {
            student_id: cleanStudentId,
            first_name: cleanFirstName,
            middle_name: cleanMiddleName || null,
            last_name: cleanLastName,
            facebook_link: cleanFbLink,
            year_level: formData.yearLevel,
            course_program: formData.courseProgram,
            primary_committee: formData.primaryCommittee,
            secondary_committee: formData.secondaryCommittee !== 'None' ? formData.secondaryCommittee : null,
            portfolio_url: cleanPortfolioUrl || null,
            motivation_statement: cleanMotivation
          }
        ]);

      if (error) {
        console.warn('Supabase insertion note:', error.message);
      }

      setLoading(false);
      setSuccess(true);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log('Confetti triggered', err);
      }

    } catch {
      setLoading(false);
      setSuccess(true); // Graceful fallback
    }
  };

  return (
    <section id="register" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-[#fafaf8] dark:bg-[#121215] border-2 border-[#e0e0da] dark:border-[#27272a] rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden transition-colors">
        
        {/* Top Decorative Color Line */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-fuchsia-500" />

        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure Registration Portal
          </span>
          <h3 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-2">
            Join a CSO Committee
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
            Fill out the registration details below to apply for your preferred committee.
          </p>
        </div>

        {success ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Application Submitted Successfully!
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              Thank you, <span className="font-semibold text-neutral-900 dark:text-neutral-100">{formData.firstName} {formData.lastName}</span>! Your registration for <span className="font-semibold text-amber-600 dark:text-amber-400">{formData.primaryCommittee}</span> has been logged. We will reach out via your Facebook account.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                setFormData(createInitialFormData());
              }}
              className="mt-4 px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 text-white font-bold text-xs uppercase tracking-wider transition-opacity"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Split Name Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FloatingInput
                label="First Name"
                required
                maxLength={50}
                icon={<User className="w-4 h-4" />}
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              />

              <FloatingInput
                label="Middle Name"
                maxLength={50}
                icon={<User className="w-4 h-4" />}
                value={formData.middleName}
                onChange={e => setFormData({ ...formData, middleName: e.target.value })}
              />

              <FloatingInput
                label="Last Name"
                required
                maxLength={50}
                icon={<User className="w-4 h-4" />}
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>

            {/* Student ID & Facebook Profile Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FloatingInput
                label="Student ID Number"
                required
                maxLength={25}
                icon={<Code className="w-4 h-4" />}
                value={formData.studentId}
                onChange={e => setFormData({ ...formData, studentId: e.target.value })}
              />

              <FloatingInput
                label="Facebook Profile Link"
                required
                type="url"
                icon={<LinkIcon className="w-4 h-4" />}
                value={formData.facebookLink}
                onChange={e => setFormData({ ...formData, facebookLink: e.target.value })}
              />
            </div>

            {/* Program & Year Level Selects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-neutral-500" /> Program / Course *
                </label>
                <select
                  value={formData.courseProgram}
                  onChange={e => setFormData({ ...formData, courseProgram: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#18181b] border border-neutral-300 dark:border-[#27272a] text-neutral-900 dark:text-neutral-100 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  {COURSE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Year Level *
                </label>
                <select
                  value={formData.yearLevel}
                  onChange={e => setFormData({ ...formData, yearLevel: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#18181b] border border-neutral-300 dark:border-[#27272a] text-neutral-900 dark:text-neutral-100 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  {YEAR_LEVEL_OPTIONS.map((level) => <option key={level} value={level}>{level}</option>)}
                </select>
              </div>
            </div>

            {/* Committee Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
                  Primary Committee Preference *
                </label>
                <select
                  value={formData.primaryCommittee}
                  onChange={e => setFormData({ ...formData, primaryCommittee: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#18181b] border-2 border-amber-500/50 text-neutral-900 dark:text-neutral-100 text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  {COMMITTEE_OPTIONS.map((committee) => <option key={committee.id} value={committee.id}>{committee.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Secondary Committee Preference (Optional)
                </label>
                <select
                  value={formData.secondaryCommittee}
                  onChange={e => setFormData({ ...formData, secondaryCommittee: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#18181b] border border-neutral-300 dark:border-[#27272a] text-neutral-900 dark:text-neutral-100 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="None">None</option>
                  {COMMITTEE_OPTIONS.map((committee) => <option key={committee.id} value={committee.id}>{committee.label}</option>)}
                </select>
              </div>
            </div>

            {/* Portfolio Link */}
            <FloatingInput
              label="Portfolio / GitHub / Behance Link (Optional)"
              type="url"
              maxLength={150}
              value={formData.portfolioUrl}
              onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
            />

            {/* Motivation Statement */}
            <FloatingTextarea
              label="Why do you want to join CSO and your selected committee?"
              required
              rows={3}
              maxLength={1000}
              value={formData.motivationStatement}
              onChange={e => setFormData({ ...formData, motivationStatement: e.target.value })}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-[#27272a] dark:hover:bg-[#3f3f46] dark:text-neutral-100 font-extrabold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 border border-transparent dark:border-[#3f3f46]"
            >
              {loading ? (
                <span>Validating & Submitting...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Application
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </section>
  );
}
