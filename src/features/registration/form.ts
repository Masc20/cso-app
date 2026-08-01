export interface RegistrationFormData {
  studentId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  facebookLink: string;
  yearLevel: string;
  courseProgram: string;
  primaryCommittee: string;
  secondaryCommittee: string;
  portfolioUrl: string;
  motivationStatement: string;
}

export const createInitialFormData = (primaryCommittee = 'Programming Committee'): RegistrationFormData => ({
  studentId: '', firstName: '', middleName: '', lastName: '', facebookLink: '',
  yearLevel: '1st Year', courseProgram: 'BSIT', primaryCommittee,
  secondaryCommittee: 'None', portfolioUrl: '', motivationStatement: '',
});

export const YEAR_LEVEL_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
export const COURSE_OPTIONS = [
  ['BSIT', 'BSIT (Information Technology)'],
  ['BSCS', 'BSCS (Computer Science)'],
  ['BSA', 'Accounting'],
  ['BSBA', 'Business Administration'],
  ['BSHM', 'Hotel Management'],
  ['Other Senior High / Tech Track', 'Other Senior High / Tech Track'],
] as const;
