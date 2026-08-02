import type { RegistrationFormData } from '@/types';
import { YEAR_LEVEL_OPTIONS, COURSE_OPTIONS } from '@/data/options';

export type { RegistrationFormData };
export { YEAR_LEVEL_OPTIONS, COURSE_OPTIONS };

export const createInitialFormData = (primaryCommittee = 'Programming Committee'): RegistrationFormData => ({
  studentId: '', firstName: '', middleName: '', lastName: '', facebookLink: '',
  yearLevel: '1st Year', courseProgram: 'BSIT', primaryCommittee,
  secondaryCommittee: 'None', portfolioUrl: '', motivationStatement: '',
});
