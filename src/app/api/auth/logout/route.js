// src/app/api/auth/logout/route.js - Logout endpoint (App Router)
import { AuthService } from '../../../../lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const token = request.cookies.get('session')?.value;

    if (token) {
      // Delete session from database
      await AuthService.deleteSession(token);
    }

    // Create response
    const response = NextResponse.json({ success: true });

    // Clear the session cookie
    response.cookies.set('session', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
      sameSite: 'lax'
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}