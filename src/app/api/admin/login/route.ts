import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { sanitizeString } from '@/lib/utils/validation';
import { getClientIp } from '@/lib/utils/formatting';
import {
  checkServerRateLimit,
  recordFailedServerAttempt,
  resetServerRateLimit
} from '@/lib/serverRateLimit';

export async function POST(req: NextRequest) {
  try {
    // Extract Client IP address using centralized formatting utility
    const clientIp = getClientIp(req);

    const limitCheck = checkServerRateLimit(clientIp);

    if (!limitCheck.success) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts (3/3). Account locked for ${limitCheck.retryAfterSeconds} seconds.`,
          isLocked: true,
          retryAfterSeconds: limitCheck.retryAfterSeconds
        },
        { status: 429 }
      );
    }

    // Parse & Sanitize Request Payload
    const body = await req.json();
    const email = sanitizeString(body.email || '');
    const password = body.password || '';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      // Record failed attempt in server RAM
      const failedResult = recordFailedServerAttempt(clientIp);

      if (failedResult.isLocked) {
        return NextResponse.json(
          {
            error: 'Maximum 3 failed attempts reached! Form locked for 60 seconds.',
            isLocked: true,
            retryAfterSeconds: 60
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: `${error.message} (${failedResult.remainingAttempts} ${failedResult.remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining)`,
          remainingAttempts: failedResult.remainingAttempts
        },
        { status: 401 }
      );
    }

    resetServerRateLimit(clientIp);

    return NextResponse.json({
      success: true,
      session: data.session
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Server error during authentication.' },
      { status: 500 }
    );
  }
}
