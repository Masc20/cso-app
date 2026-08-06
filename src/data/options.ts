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
  ['Other Senior High / Tech Track', 'Other Senior High / Tech Track'],
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
