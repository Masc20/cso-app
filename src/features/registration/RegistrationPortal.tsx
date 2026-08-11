'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Send, CheckCircle2, AlertCircle, User, Link as LinkIcon, GraduationCap, Code, ExternalLink, Clock, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FloatingInput, FloatingTextarea, FloatingSelect } from '@/components/ui';
import { fetchRegistrationStatus, fetchCommittees } from '@/features/admin';
import { sanitizeString, isValidFacebookUrl, isValidHttpUrl, formatStudentId, normalizeUrlInput } from '@/lib/utils';
import { useToast } from '@/hooks';
import { COURSE_OPTIONS, YEAR_LEVEL_OPTIONS } from '@/data';
import type { RegistrationPortalProps, Committee } from '@/types';

export default function RegistrationPortal({ selectedCommittee }: RegistrationPortalProps) {
  const { showToast } = useToast();
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [activeCommittees, setActiveCommittees] = useState<Committee[]>([]);
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

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const markTouched = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  // Real-time Field Errors Calculation
  const fieldErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First Name is required.';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last Name is required.';
    }

    if (!formData.studentId.trim()) {
      errors.studentId = 'Student ID Number is required.';
    } else if (formData.studentId.trim().length < 3) {
      errors.studentId = 'Student ID must be at least 3 characters.';
    }

    const normalizedFb = normalizeUrlInput(formData.facebookLink);
    if (!formData.facebookLink.trim()) {
      errors.facebookLink = 'Facebook Profile Link is required.';
    } else if (!isValidFacebookUrl(normalizedFb)) {
      errors.facebookLink = 'Please provide a valid Facebook Profile Link (e.g. facebook.com/your.profile).';
    }

    if (!formData.courseProgram) {
      errors.courseProgram = 'Please select your Program / Course.';
    }

    if (!formData.yearLevel) {
      errors.yearLevel = 'Please select your Year Level.';
    }

    if (!formData.primaryCommittee) {
      errors.primaryCommittee = 'Please select your Primary Committee Preference.';
    }

    if (!formData.motivationStatement.trim()) {
      errors.motivationStatement = 'Motivation statement is required.';
    } else if (formData.motivationStatement.trim().length < 10) {
      errors.motivationStatement = 'Please write at least 10 characters explaining your interest.';
    }

    if (formData.portfolioUrl.trim()) {
      const normalizedPort = normalizeUrlInput(formData.portfolioUrl);
      if (!isValidHttpUrl(normalizedPort)) {
        errors.portfolioUrl = 'Please enter a valid Web/GitHub/Portfolio URL.';
      }
    }

    return errors;
  }, [formData]);

  const isFormValid = Object.keys(fieldErrors).length === 0;

  useEffect(() => {
    const checkStatusAndCommittees = async () => {
      const open = await fetchRegistrationStatus();
      setIsRegistrationOpen(open);
      try {
        const comms = await fetchCommittees(false);
        if (comms && comms.length > 0) {
          setActiveCommittees(comms);
        }
      } catch (err) {
        console.warn('Failed to load active committees for form:', err);
      }
    };
    checkStatusAndCommittees();
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
      secondaryCommittee: prev.secondaryCommittee === newPrimary ? 'None' : prev.secondaryCommittee
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouchedFields({
      firstName: true,
      lastName: true,
      studentId: true,
      facebookLink: true,
      courseProgram: true,
      yearLevel: true,
      primaryCommittee: true,
      motivationStatement: true,
      portfolioUrl: true
    });

    if (!isRegistrationOpen || cooldownSeconds > 0) return;

    if (!isFormValid) {
      const firstErrKey = Object.keys(fieldErrors)[0];
      setErrorMsg(`Please fix the errors below before submitting: ${fieldErrors[firstErrKey]}`);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const cleanStudentId = sanitizeString(formData.studentId);
    const cleanFirstName = sanitizeString(formData.firstName);
    const cleanMiddleName = sanitizeString(formData.middleName);
    const cleanLastName = sanitizeString(formData.lastName);
    const cleanFbLink = sanitizeString(normalizeUrlInput(formData.facebookLink));
    const cleanPortfolioUrl = sanitizeString(normalizeUrlInput(formData.portfolioUrl));
    const cleanMotivation = sanitizeString(formData.motivationStatement);

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
      setTouchedFields({});
      showToast('Application submitted successfully!', 'success');

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }

    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : 'Connection error. Please try again.';
      setErrorMsg(msg);
    }
  };

  const handleResetForm = () => {
    setFormData({
      studentId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      facebookLink: '',
      yearLevel: '',
      courseProgram: '',
      primaryCommittee: '',
      secondaryCommittee: 'None',
      portfolioUrl: '',
      motivationStatement: ''
    });
    setSuccess(false);
    setErrorMsg('');
    setTouchedFields({});
  };

  const committeeSelectOptions = useMemo(() => {
    const list = activeCommittees.length > 0
      ? activeCommittees.map(c => ({ value: c.name, label: c.name }))
      : [
          { value: 'G.A.D Committee', label: 'G.A.D Committee' },
          { value: 'Gaming Committee', label: 'Gaming Committee' },
          { value: 'Networking Committee', label: 'Networking Committee' },
          { value: 'Programming Committee', label: 'Programming Committee' }
        ];

    return list;
  }, [activeCommittees]);

  const secondaryCommitteeOptions = useMemo(() => {
    const baseOptions = [{ value: 'None', label: 'None (Primary Only)' }];
    const filtered = committeeSelectOptions.filter(opt => opt.value !== formData.primaryCommittee);
    return [...baseOptions, ...filtered];
  }, [committeeSelectOptions, formData.primaryCommittee]);

  const activeCommitteesMap = useMemo(() => {
    const map = new Map<string, Committee>();
    activeCommittees.forEach(c => map.set(c.name, c));
    return map;
  }, [activeCommittees]);

  return (
    <section id="register" className="relative w-full py-16 px-4 bg-[#e5e5df] dark:bg-[#121215] transition-colors">
      <div className="max-w-3xl mx-auto bg-cso-card border border-cso rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6">
        
        {/* Section Header */}
        <div className="text-center space-y-2 border-b border-cso pb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Official Registration Portal
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Apply for CSO Committee Membership
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium">
            Fill in your details below to join the Computer Studies Organization for School Year 2025-2026.
          </p>
        </div>

        {/* Closed Registration Banner */}
        {!isRegistrationOpen && (
          <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-center space-y-2">
            <Clock className="w-8 h-8 mx-auto" />
            <h3 className="text-lg font-black uppercase tracking-wider">Recruitment Portal Closed</h3>
            <p className="text-xs font-medium max-w-md mx-auto">
              CSO committee registration is currently closed or under officer review. Please check back later or contact an officer.
            </p>
          </div>
        )}

        {/* Success Confirmation Card */}
        {success ? (
          <div className="p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100">
                Application Submitted Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 font-medium max-w-md mx-auto leading-relaxed">
                Thank you for applying to join the Computer Studies Organization! Your application has been logged. Our officers will review your submission and reach out via Facebook.
              </p>
            </div>
            
            <button
              onClick={handleResetForm}
              className="mt-4 px-6 py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-extrabold text-xs uppercase tracking-wider hover:bg-neutral-800 dark:hover:bg-white transition-colors shadow-md"
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

            {/* Standard Error Alert Banner */}
            {cooldownSeconds <= 0 && errorMsg && (
              <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-bold animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
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
                onBlur={() => markTouched('firstName')}
                errorMessage={touchedFields.firstName ? fieldErrors.firstName : undefined}
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
                onBlur={() => markTouched('lastName')}
                errorMessage={touchedFields.lastName ? fieldErrors.lastName : undefined}
              />
            </div>

            {/* Student ID & Facebook Profile Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FloatingInput
                label="Student ID Number"
                required
                infoTooltip="Format: e.g. 'A00-01-...' or your LRN."
                disabled={cooldownSeconds > 0 || loading}
                maxLength={25}
                icon={<Code className="w-4 h-4" />}
                value={formData.studentId}
                onChange={e => {
                  const formatted = formatStudentId(e.target.value, formData.studentId);
                  setFormData(prev => ({ ...prev, studentId: formatted }));
                }}
                onBlur={() => markTouched('studentId')}
                errorMessage={touchedFields.studentId ? fieldErrors.studentId : undefined}
              />

              <FloatingInput
                label="Facebook Profile Link"
                required
                infoTooltip="You can enter facebook.com/your.profile or www.facebook.com/username"
                disabled={cooldownSeconds > 0 || loading}
                type="text"
                icon={<LinkIcon className="w-4 h-4" />}
                value={formData.facebookLink}
                onChange={e => setFormData({ ...formData, facebookLink: e.target.value })}
                onBlur={() => markTouched('facebookLink')}
                errorMessage={touchedFields.facebookLink ? fieldErrors.facebookLink : undefined}
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
                onBlur={() => markTouched('courseProgram')}
                errorMessage={touchedFields.courseProgram ? fieldErrors.courseProgram : undefined}
              />

              <FloatingSelect
                label="Year Level"
                required
                placeholderOption="-- Select Year Level --"
                options={YEAR_LEVEL_OPTIONS.map(yr => ({ value: yr, label: yr }))}
                value={formData.yearLevel}
                disabled={cooldownSeconds > 0 || loading}
                onChange={e => setFormData({ ...formData, yearLevel: e.target.value })}
                onBlur={() => markTouched('yearLevel')}
                errorMessage={touchedFields.yearLevel ? fieldErrors.yearLevel : undefined}
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
                onBlur={() => markTouched('primaryCommittee')}
                errorMessage={touchedFields.primaryCommittee ? fieldErrors.primaryCommittee : undefined}
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
              type="text"
              infoTooltip="Optional: Enter a web link (e.g. github.com/yourname or https://yourportfolio.com)"
              disabled={cooldownSeconds > 0 || loading}
              maxLength={150}
              value={formData.portfolioUrl}
              onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
              onBlur={() => markTouched('portfolioUrl')}
              errorMessage={touchedFields.portfolioUrl ? fieldErrors.portfolioUrl : undefined}
            />

            {/* Motivation Statement */}
            <FloatingTextarea
              label="Why do you want to join CSO and your selected committee?"
              required
              infoTooltip="Write at least 10 characters explaining your interest, technical skills, or goals with CSO."
              disabled={cooldownSeconds > 0 || loading}
              rows={3}
              minLength={10}
              maxLength={1000}
              className="pt-10 sm:pt-6"
              value={formData.motivationStatement}
              onChange={e => setFormData({ ...formData, motivationStatement: e.target.value })}
              onBlur={() => markTouched('motivationStatement')}
              errorMessage={touchedFields.motivationStatement ? fieldErrors.motivationStatement : undefined}
            />

            {/* Submit Button with Animated Loading State */}
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
