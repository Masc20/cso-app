import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { sanitizeString, isValidFacebookUrl, isValidHttpUrl } from '@/lib/utils/validation';
import { getClientIp } from '@/lib/utils/formatting';
import { fetchRegistrationStatus } from '@/features/admin/services/adminApi';
import {
  checkRegistrationRateLimit,
  recordRegistrationSubmission
} from '@/lib/serverRateLimit';

export async function POST(req: NextRequest) {
  try {

    const clientIp = getClientIp(req);

    const rateCheck = checkRegistrationRateLimit(clientIp);

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Submission limit reached (10/10 from your IP). Please wait ${rateCheck.retryAfterSeconds} seconds before submitting again.`,
          isLocked: true,
          retryAfterSeconds: rateCheck.retryAfterSeconds
        },
        { status: 429 }
      );
    }

    const isRegistrationOpen = await fetchRegistrationStatus();
    if (!isRegistrationOpen) {
      return NextResponse.json(
        { error: 'Registration is currently closed by CSO Officers.' },
        { status: 403 }
      );
    }

    const body = await req.json();

    const cleanStudentId = sanitizeString(body.studentId || '');
    const cleanFirstName = sanitizeString(body.firstName || '');
    const cleanMiddleName = sanitizeString(body.middleName || '');
    const cleanLastName = sanitizeString(body.lastName || '');
    const cleanFbLink = sanitizeString(body.facebookLink || '');
    const cleanYearLevel = sanitizeString(body.yearLevel || '1st Year');
    const cleanCourseProgram = sanitizeString(body.courseProgram || 'BSIT');
    const cleanPrimaryCommittee = sanitizeString(body.primaryCommittee || 'Programming Committee');
    const cleanSecondaryCommittee = sanitizeString(body.secondaryCommittee || 'None');
    const cleanPortfolioUrl = sanitizeString(body.portfolioUrl || '');
    const cleanMotivation = sanitizeString(body.motivationStatement || '');

    // Validation Checks
    if (!cleanFirstName || !cleanLastName) {
      return NextResponse.json({ error: 'Please enter your full first name and last name.' }, { status: 400 });
    }

    if (!cleanStudentId) {
      return NextResponse.json({ error: 'Please enter a valid Student ID Number.' }, { status: 400 });
    }

    if (!cleanFbLink || !isValidFacebookUrl(cleanFbLink)) {
      return NextResponse.json({ error: 'Please provide a valid Facebook Profile Link (e.g. https://facebook.com/your.profile).' }, { status: 400 });
    }

    if (cleanPortfolioUrl && !isValidHttpUrl(cleanPortfolioUrl)) {
      return NextResponse.json({ error: 'Please enter a valid Portfolio URL starting with http:// or https://' }, { status: 400 });
    }

    if (!cleanMotivation || cleanMotivation.length < 10) {
      return NextResponse.json({ error: 'Please write a brief motivation statement (minimum 10 characters).' }, { status: 400 });
    }

    const { error } = await supabase
      .from('committee_applications')
      .upsert(
        [
          {
            student_id: cleanStudentId,
            first_name: cleanFirstName,
            middle_name: cleanMiddleName || null,
            last_name: cleanLastName,
            facebook_link: cleanFbLink,
            year_level: cleanYearLevel,
            course_program: cleanCourseProgram,
            primary_committee: cleanPrimaryCommittee,
            secondary_committee: cleanSecondaryCommittee !== 'None' ? cleanSecondaryCommittee : null,
            portfolio_url: cleanPortfolioUrl || null,
            motivation_statement: cleanMotivation
          }
        ],
        { onConflict: 'student_id' }
      );

    if (error) {
      console.warn('Supabase upsert note:', error.message);
    }

    recordRegistrationSubmission(clientIp);

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully!'
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Server error during submission.' },
      { status: 500 }
    );
  }
}
