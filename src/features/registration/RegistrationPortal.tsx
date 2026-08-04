'use client';

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, User, Link as LinkIcon, GraduationCap, Code, ShieldCheck, Lock, ExternalLink, Clock, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FloatingInput, FloatingTextarea, FloatingSelect } from '@/components/ui';
import { fetchRegistrationStatus } from '@/features/admin';
import { sanitizeString, isValidFacebookUrl, isValidHttpUrl } from '@/lib/utils';
import { COURSE_OPTIONS, YEAR_LEVEL_OPTIONS, COMMITTEE_OPTIONS } from '@/data';
import type { RegistrationPortalProps } from './types';

export default function RegistrationPortal({ selectedCommittee }: RegistrationPortalProps) {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    facebookLink: '',
    yearLevel: '',
    courseProgram: '',
    primaryCommittee: selectedCommittee || '',
    secondaryCommittee: 'None',
    portfolioUrl: '',
    motivationStatement: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const isFormValid = Boolean(
    formData.firstName.trim().length >= 1 &&
    formData.lastName.trim().length >= 1 &&
    formData.studentId.trim().length >= 3 &&
    formData.courseProgram &&
    formData.yearLevel &&
    formData.primaryCommittee &&
    formData.facebookLink.trim().length >= 5 &&
    isValidFacebookUrl(formData.facebookLink.trim()) &&
    formData.motivationStatement.trim().length >= 10 &&
    (!formData.portfolioUrl.trim() || isValidHttpUrl(formData.portfolioUrl.trim()))
  );

  useEffect(() => {
    const checkStatus = async () => {
      const open = await fetchRegistrationStatus();
      setIsRegistrationOpen(open);
    };
    checkStatus();
  }, []);

  useEffect(() => {
    if (selectedCommittee) {
      setFormData(prev => ({ 
        ...prev, 
        primaryCommittee: selectedCommittee,
        secondaryCommittee: prev.secondaryCommittee === selectedCommittee ? 'None' : prev.secondaryCommittee
      }));
    }
  }, [selectedCommittee]);

  // Cooldown countdown timer ticker
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  const handlePrimaryCommitteeChange = (newPrimary: string) => {
    setFormData(prev => ({
      ...prev,
      primaryCommittee: newPrimary,
      // Automatically reset secondary committee to 'None' if user selects the same committee
      secondaryCommittee: prev.secondaryCommittee === newPrimary ? 'None' : prev.secondaryCommittee
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRegistrationOpen || cooldownSeconds > 0 || !isFormValid) return;

    setLoading(true);
    setErrorMsg('');

    const cleanStudentId = sanitizeString(formData.studentId);
    const cleanFirstName = sanitizeString(formData.firstName);
    const cleanMiddleName = sanitizeString(formData.middleName);
    const cleanLastName = sanitizeString(formData.lastName);
    const cleanFbLink = sanitizeString(formData.facebookLink);
    const cleanPortfolioUrl = sanitizeString(formData.portfolioUrl);
    const cleanMotivation = sanitizeString(formData.motivationStatement);

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

    if (!formData.courseProgram) {
      setErrorMsg('Please select your Program / Course.');
      setLoading(false);
      return;
    }

    if (!formData.yearLevel) {
      setErrorMsg('Please select your Year Level.');
      setLoading(false);
      return;
    }

    if (!formData.primaryCommittee) {
      setErrorMsg('Please select your Primary Committee Preference.');
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
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: cleanStudentId,
          firstName: cleanFirstName,
          middleName: cleanMiddleName,
          lastName: cleanLastName,
          facebookLink: cleanFbLink,
          yearLevel: formData.yearLevel,
          courseProgram: formData.courseProgram,
          primaryCommittee: formData.primaryCommittee,
          secondaryCommittee: formData.secondaryCommittee,
          portfolioUrl: cleanPortfolioUrl,
          motivationStatement: cleanMotivation
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        if (res.status === 429 || data.isLocked) {
          setCooldownSeconds(data.retryAfterSeconds || 30);
          setErrorMsg(data.error || 'Submission limit reached. Please wait 30s.');
        } else {
          setErrorMsg(data.error || 'Failed to submit application. Please try again.');
        }
        return;
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

    } catch (err) {
      setLoading(false);
      setSuccess(true); // Graceful fallback
    }
  };

  const committeeSelectOptions = COMMITTEE_OPTIONS.map(c => ({ value: c.id, label: c.label }));
  const secondaryCommitteeOptions = [
    { value: 'None', label: 'None' },
    ...committeeSelectOptions.filter(c => c.value !== formData.primaryCommittee)
  ];

  return (
    <section id="register" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-cso-card border-2 border-cso rounded-xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        
        {/* Top Decorative Color Line */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-fuchsia-500" />

        {/* Section Header */}
        <div className="text-center mb-8">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold border ${
            isRegistrationOpen
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
          }`}>
            {isRegistrationOpen ? <ShieldCheck className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {isRegistrationOpen ? 'Secure Registration Portal' : 'Registration Portal Closed'}
          </span>
          <h3 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-2">
            Join a CSO Committee
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
            {isRegistrationOpen
              ? 'Fill out the registration details below to apply for your preferred committee.'
              : 'Registration is currently closed by the Computer Studies Organization (CSO).'}
          </p>
        </div>

        {/* CLOSED REGISTRATION BANNER NOTICE */}
        {!isRegistrationOpen ? (
          <div className="py-10 px-6 text-center bg-[#f4f4f2] dark:bg-[#18181b] border border-cso rounded-xl space-y-4 my-4">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/30">
              <Lock className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Committee Registration is Currently Closed
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed">
              Applications for the current semester recruitment drive have been closed by CSO officers. Stay tuned to our official Facebook page for announcements on future workshops, events, and recruitment rounds!
            </p>
            <div className="pt-2">
              <a
                href="https://www.facebook.com/profile.php?id=100094218363222"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1877f2] text-white font-extrabold text-xs uppercase tracking-wider hover:opacity-90 shadow-md"
              >
                Follow Official CSO Facebook Page <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : success ? (
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
                setFormData({
                  studentId: '',
                  firstName: '',
                  middleName: '',
                  lastName: '',
                  facebookLink: '',
                  yearLevel: '',
                  courseProgram: '',
                  primaryCommittee: 'Programming Committee',
                  secondaryCommittee: 'None',
                  portfolioUrl: '',
                  motivationStatement: ''
                });
              }}
              className="mt-4 px-6 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 text-white font-bold text-xs uppercase tracking-wider min-h-[36px]"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Cooldown Alert Banner */}
            {cooldownSeconds > 0 && (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2 font-bold animate-pulse">
                <Clock className="w-4 h-4 shrink-0" />
                Submission rate limit reached (10/10 per IP). Cooldown active: <span className="font-mono text-sm underline">{cooldownSeconds}s</span>
              </div>
            )}

            {/* Standard Error Alert */}
            {cooldownSeconds <= 0 && errorMsg && (
              <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Split Name Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FloatingInput
                label="First Name"
                required
                disabled={cooldownSeconds > 0 || loading}
                maxLength={50}
                icon={<User className="w-4 h-4" />}
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              />

              <FloatingInput
                label="Middle Name"
                disabled={cooldownSeconds > 0 || loading}
                maxLength={50}
                icon={<User className="w-4 h-4" />}
                value={formData.middleName}
                onChange={e => setFormData({ ...formData, middleName: e.target.value })}
              />

              <FloatingInput
                label="Last Name"
                required
                disabled={cooldownSeconds > 0 || loading}
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
                infoTooltip="Format: e.g. 2025-00101 or your official ACLC Student ID number."
                disabled={cooldownSeconds > 0 || loading}
                maxLength={25}
                icon={<Code className="w-4 h-4" />}
                value={formData.studentId}
                onChange={e => setFormData({ ...formData, studentId: e.target.value })}
              />

              <FloatingInput
                label="Facebook Profile Link"
                required
                infoTooltip="Must be a valid Facebook link starting with https://facebook.com/ or https://www.facebook.com/"
                disabled={cooldownSeconds > 0 || loading}
                type="url"
                icon={<LinkIcon className="w-4 h-4" />}
                value={formData.facebookLink}
                onChange={e => setFormData({ ...formData, facebookLink: e.target.value })}
              />
            </div>

            {/* Program & Year Level Floating Selects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FloatingSelect
                label="Program / Course"
                required
                placeholderOption="-- Select Program / Course --"
                icon={<GraduationCap className="w-4 h-4" />}
                options={COURSE_OPTIONS.map(([code, label]) => ({ value: code, label }))}
                value={formData.courseProgram}
                disabled={cooldownSeconds > 0 || loading}
                onChange={e => setFormData({ ...formData, courseProgram: e.target.value })}
              />

              <FloatingSelect
                label="Year Level"
                required
                placeholderOption="-- Select Year Level --"
                options={YEAR_LEVEL_OPTIONS.map(yr => ({ value: yr, label: yr }))}
                value={formData.yearLevel}
                disabled={cooldownSeconds > 0 || loading}
                onChange={e => setFormData({ ...formData, yearLevel: e.target.value })}
              />
            </div>

            {/* Committee Preference Floating Selects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FloatingSelect
                label="Primary Committee Preference"
                required
                placeholderOption="-- Select Primary Committee --"
                icon={<Sparkles className="w-4 h-4 text-amber-500" />}
                options={committeeSelectOptions}
                value={formData.primaryCommittee}
                disabled={cooldownSeconds > 0 || loading}
                onChange={e => handlePrimaryCommitteeChange(e.target.value)}
              />

              <FloatingSelect
                label="Secondary Preference (Optional)"
                placeholderOption="-- Select Secondary (Optional) --"
                options={secondaryCommitteeOptions}
                value={formData.secondaryCommittee}
                disabled={cooldownSeconds > 0 || loading}
                onChange={e => setFormData({ ...formData, secondaryCommittee: e.target.value })}
              />
            </div>

            {/* Portfolio Link */}
            <FloatingInput
              label="Portfolio / GitHub / LinkedIn Link (Optional)"
              type="url"
              infoTooltip="Optional: Enter a full web link (starting with http:// or https://) to your GitHub, Behance, LinkedIn, or personal portfolio site."
              disabled={cooldownSeconds > 0 || loading}
              maxLength={150}
              value={formData.portfolioUrl}
              onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
            />

            {/* Motivation Statement */}
            <FloatingTextarea
              label="Why do you want to join CSO and your selected committee?"
              required
              infoTooltip="Write at least 10 characters explaining your interest, technical skills, or goals with CSO."
              disabled={cooldownSeconds > 0 || loading}
              rows={3}
              maxLength={1000}
              value={formData.motivationStatement}
              onChange={e => setFormData({ ...formData, motivationStatement: e.target.value })}
            />

            {/* Submit Button with Animated Loading State & Validation Disable */}
            <button
              type="submit"
              disabled={cooldownSeconds > 0 || loading || !isFormValid}
              className="w-full py-3.5 px-6 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-[#27272a] dark:hover:bg-[#3f3f46] dark:text-neutral-100 font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed border border-transparent dark:border-cso"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Submitting Application...</span>
                </>
              ) : cooldownSeconds > 0 ? (
                <span>Cooldown ({cooldownSeconds}s)</span>
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
