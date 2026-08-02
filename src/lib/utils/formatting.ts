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
 * Extracts client IP address from Next.js server request headers.
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  return forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';
}
