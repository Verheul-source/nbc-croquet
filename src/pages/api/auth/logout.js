// src/pages/api/auth/logout.js - Logout endpoint
import { AuthService } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = req.cookies.session;

  if (token) {
    // Delete session from database
    await AuthService.deleteSession(token);
  }

  // Clear the session cookie
  res.setHeader('Set-Cookie', [
    'session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
  ]);

  res.status(200).json({ success: true });
}