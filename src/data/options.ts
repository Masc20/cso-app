export const YEAR_LEVEL_OPTIONS = [
  'Senior High',
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
] as const;

export const COURSE_OPTIONS = [
  ['BSIT', 'BSIT (Information Technology)'],
  ['BSCS', 'BSCS (Computer Science)'],
  ['BSA', 'BSA (Accounting)'],
  ['BSBA', 'BSBA (Business Administration)'],
  ['BSHM', 'BSHM (Hotel Management)'],
  ['WADT', 'WADT (Web Application Developement Technology)'],
  ['HRT', 'HRT (Hotel and Restauran Technology)'],
  ['Other Senior High / Tech Track', 'Other Senior High / Tech Track'],
] as const;

export const COMMITTEE_OPTIONS = [
  { id: 'G.A.D Committee', label: 'G.A.D Committee' },
  { id: 'Gaming Committee', label: 'Gaming Committee' },
  { id: 'Networking Committee', label: 'Networking Committee' },
  { id: 'Programming Committee', label: 'Programming Committee' },
] as const;

export const STATUS_OPTIONS = [
  'All',
  'Pending',
  'Approved',
  'Under Review',
  'Contacted'
] as const;

export const OFFICER_ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Admin (Full Organizational Access)' },
  { value: 'officer', label: 'Committee Officer (Scoped Access)' }
] as const;

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50] as const;
