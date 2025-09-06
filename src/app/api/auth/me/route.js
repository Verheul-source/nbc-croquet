// src/app/api/auth/me/route.js - Get current user endpoint (App Router)
import { AuthService } from '../../../../lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const token = request.cookies.get('session')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No session token' }, { status: 401 });
    }

    const session = await AuthService.getSession(token);

    if (!session) {
      // Clear invalid cookie
      const response = NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
      response.cookies.set('session', '', {
        httpOnly: true,
        path: '/',
        maxAge: 0,
        sameSite: 'lax'
      });
      return response;
    }

    return NextResponse.json({ user: session.user });
  } catch (error) {
    console.error('Session lookup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}