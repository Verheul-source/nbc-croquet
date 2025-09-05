// src/pages/api/auth/me.js - Get current user endpoint
import { AuthService } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.cookies.session;

  if (!token) {
    return res.status(401).json({ error: 'No session token' });
  }

  try {
    const session = await AuthService.getSession(token);

    if (!session) {
      // Clear invalid cookie
      res.setHeader('Set-Cookie', [
        'session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
      ]);
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    res.status(200).json({ user: session.user });
  } catch (error) {
    console.error('Session lookup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}