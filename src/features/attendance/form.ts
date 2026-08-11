/**
 * ====================================================================
 * TODO: CSO EVENT ATTENDANCE VERIFICATION FEATURE SPECIFICATION
 * ====================================================================
 * 
 * Technical Requirements & Feature Blueprint:
 * 
 * 1. Hybrid Venue Verification:
 *    - Officers project a dynamic 6-digit PIN or QR code at event venue.
 *    - Students scan QR or enter 6-digit PIN + Student ID to verify physical presence.
 * 
 * 2. Smart Student Lookup & Registration Integration:
 *    - Open to all ACLC students.
 *    - Auto-detects student name, course, and year level if student ID exists in
 *      committee_applications database, while allowing manual entry for non-applicants.
 * 
 * 3. Prevention of Remote Spamming & Duplicate Check-Ins:
 *    - Enforces UNIQUE (event_id, student_id) constraint in Supabase database.
 *    - Verifies live gate status (cso_events.status === 'Live').
 * 
 * 4. Executive Officer Command Center:
 *    - Real-time live attendance log table in Admin Dashboard.
 *    - One-click CSV Export (.csv) for event attendance reports.
 */

export interface EventAttendanceFormState {
  eventId: string;
  studentId: string;
  fullName: string;
  courseProgram: string;
  yearLevel: string;
  passcode: string;
}

export interface VerificationResult {
  success: boolean;
  message: string;
  verifiedAt?: string;
  ticketBadge?: {
    eventTitle: string;
    studentName: string;
    studentId: string;
  };
}


// Goodluck with that HAHAHHAHAHAHAHAH