import { NextRequest } from 'next/server';

/**
 * Returns Tailwind CSS styling classes for application status badges.
 */
export function getStatusBadgeClass(status: string): string {
  switch (status) {
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
}

/**
 * Returns Tailwind CSS styling classes for committee badges based on division identity.
 */
export function getCommitteeBadgeClass(committeeName: string): string {
  const comm = (committeeName || '').toLowerCase();
  if (comm.includes('g.a.d') || comm.includes('gad')) {
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
  }
  if (comm.includes('gaming')) {
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
  }
  if (comm.includes('networking')) {
    return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30';
  }
  if (comm.includes('programming')) {
    return 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/30';
  }
  return 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/30';
}

/**
 * Returns text color class for committee options.
 */
export function getCommitteeTextColorClass(committeeName: string): string {
  const comm = (committeeName || '').toLowerCase();
  if (comm.includes('g.a.d') || comm.includes('gad')) {
    return 'text-amber-600 dark:text-amber-400 font-bold';
  }
  if (comm.includes('gaming')) {
    return 'text-emerald-600 dark:text-emerald-400 font-bold';
  }
  if (comm.includes('networking')) {
    return 'text-sky-600 dark:text-sky-400 font-bold';
  }
  if (comm.includes('programming')) {
    return 'text-fuchsia-600 dark:text-fuchsia-400 font-bold';
  }
  return 'text-neutral-800 dark:text-neutral-200 font-bold';
}

/**
 * Returns text color class for status options.
 */
export function getStatusTextColorClass(status: string): string {
  switch (status) {
    case 'Approved':
      return 'text-emerald-600 dark:text-emerald-400 font-bold';
    case 'Contacted':
      return 'text-sky-600 dark:text-sky-400 font-bold';
    case 'Under Review':
      return 'text-amber-600 dark:text-amber-400 font-bold';
    case 'Rejected':
      return 'text-rose-600 dark:text-rose-400 font-bold';
    case 'Pending':
      return 'text-amber-600 dark:text-amber-400 font-bold';
    default:
      return 'text-neutral-800 dark:text-neutral-200 font-bold';
  }
}

/**
 * Extracts client IP address from Next.js server request headers.
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  return forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';
}

/**
 * Auto-URL Helper: Resolves committee video filename or full URL.
 */
export function getCommitteeVideoUrl(pathOrUrl?: string): string {
  if (!pathOrUrl || !pathOrUrl.trim()) return '';
  const trimmed = pathOrUrl.trim();
  
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  return `${supabaseUrl}/storage/v1/object/public/cso-videos/${trimmed}`;
}

/**
 * Formats raw student ID input by auto-appending prefixes based on character length and patterns.
 */
export function formatStudentId(inputValue: string, prevValue: string = ''): string {
  let value = inputValue.toUpperCase();

  if (prevValue && value.length < prevValue.length) {
    return value;
  }

  const startsWithLetter = /^[A-Z]/.test(value);

  if (startsWithLetter && value.length === 4 && !value.endsWith('-')) {
    value = `${value}-01-`;
  } else if (startsWithLetter && value.length === 12 && !value.endsWith('-')) {
    value = `${value}-MAN121`;
  }

  return value;
}

export function normalizeUrlInput(urlStr: string): string {
  const trimmed = urlStr.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}