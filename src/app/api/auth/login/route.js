// src/app/api/auth/login/route.js - Login endpoint (App Router)
import { AuthService } from '../../../../lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const result = await AuthService.authenticate(email, password);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: result.user
    });

    // Set HTTP-only cookie with session token
    response.cookies.set('session', result.token, {
      httpOnly: true,
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}