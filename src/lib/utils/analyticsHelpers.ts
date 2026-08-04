import type { ApplicationRecord } from '@/types';

/**
 * Calculates committee application demand breakdown counts.
 */
export function calculateCommitteeCounts(applications: ApplicationRecord[]): Record<string, number> {
  const counts: Record<string, number> = {
    'G.A.D Committee': 0,
    'Gaming Committee': 0,
    'Networking Committee': 0,
    'Programming Committee': 0
  };

  applications.forEach(a => {
    let key = a.primary_committee || 'Programming Committee';
    if (key === 'G.A.D') key = 'G.A.D Committee';
    counts[key] = (counts[key] || 0) + 1;
  });

  return counts;
}

/**
 * Determines the top choice committee based on application volume.
 */
export function calculateTopCommittee(counts: Record<string, number>): string {
  let topCommittee = 'Programming';
  let maxCount = -1;

  Object.entries(counts).forEach(([comm, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topCommittee = comm.replace(' Committee', '');
    }
  });

  return topCommittee;
}
