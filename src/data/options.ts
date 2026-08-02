export const YEAR_LEVEL_OPTIONS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year'
] as const;

export const COURSE_OPTIONS = [
  ['BSIT', 'BSIT (Information Technology)'],
  ['BSCS', 'BSCS (Computer Science)'],
  ['Associate in Computer Tech', 'Associate in Computer Tech'],
  ['Other Senior High / Tech Track', 'Other Senior High / Tech Track'],
] as const;

export const STATUS_FILTER_OPTIONS = [
  'All',
  'Pending',
  'Approved',
  'Under Review',
  'Contacted'
] as const;

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50] as const;
