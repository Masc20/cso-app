import type { ApplicationRecord } from '@/types';

/**
 * Triggers browser CSV download of application records.
 */
export function exportApplicationsToCsv(applications: ApplicationRecord[]): void {
  if (applications.length === 0) return;

  const headers = [
    'Student ID', 
    'First Name', 
    'Middle Name', 
    'Last Name', 
    'Facebook Link', 
    'Program', 
    'Year Level', 
    'Primary Committee', 
    'Secondary Committee', 
    'Status', 
    'Date Submitted'
  ];

  const rows = applications.map(a => [
    `"${a.student_id}"`,
    `"${a.first_name}"`,
    `"${a.middle_name || ''}"`,
    `"${a.last_name}"`,
    `"${a.facebook_link}"`,
    `"${a.course_program}"`,
    `"${a.year_level}"`,
    `"${a.primary_committee}"`,
    `"${a.secondary_committee || 'None'}"`,
    `"${a.application_status || 'Pending'}"`,
    `"${new Date(a.created_at).toLocaleDateString()}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `CSO_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
