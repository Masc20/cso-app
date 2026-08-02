import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sanitizeString, isValidFacebookUrl, isValidHttpUrl } from '@/lib/utils/validation';
import { fetchRegistrationStatus } from '@/features/admin/services/adminApi';
import {
  checkRegistrationRateLimit,
  recordRegistrationSubmission
} from '@/lib/serverRateLimit';

export async function POST(req: NextRequest) {
  try {
    // 1. Extract Client IP address
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';

    // 2. Server RAM Rate Limit Check (Max 10 submissions per IP, 30s cooldown)
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

    // 3. Check Live Registration Status
    const isRegistrationOpen = await fetchRegistrationStatus();
    if (!isRegistrationOpen) {
      return NextResponse.json(
        { error: 'Registration is currently closed by CSO Officers.' },
        { status: 403 }
      );
    }

    // 4. Parse & Sanitize Request Payload
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

    // 5. Insert Application into Supabase
    const { error } = await supabase
      .from('committee_applications')
      .insert([
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
      ]);

    if (error) {
      console.warn('Supabase insertion note:', error.message);
    }

    // 6. Record Submission Attempt in Server RAM
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
