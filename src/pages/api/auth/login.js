// src/pages/api/auth/login.js - Login endpoint
import { AuthService } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await AuthService.authenticate(email, password);

    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }

    // Set HTTP-only cookie with session token
    res.setHeader('Set-Cookie', [
      `session=${result.token}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    ]);

    res.status(200).json({
      success: true,
      user: result.user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}