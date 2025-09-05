// src/lib/auth.js - Authentication utilities
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthService {
  // Hash password for storage
  static async hashPassword(password) {
    return bcrypt.hash(password, 12);
  }

  // Verify password against hash
  static async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  // Generate secure session token
  static generateSessionToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Create session in database
  static async createSession(userId) {
    const token = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const session = await prisma.session.create({
      data: {
        userId,
        token,
        expiresAt
      },
      include: {
        user: true
      }
    });

    return session;
  }

  // Get session by token
  static async getSession(token) {
    if (!token) return null;

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.session.delete({ where: { id: session.id } });
      }
      return null;
    }

    return session;
  }

  // Delete session (logout)
  static async deleteSession(token) {
    if (!token) return;

    await prisma.session.deleteMany({
      where: { token }
    });
  }

  // Clean expired sessions
  static async cleanExpiredSessions() {
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  }

  // Authenticate user credentials - THIS WAS MISSING!
  static async authenticate(email, password) {
    try {
      console.log('🔍 Authenticating user:', email);
      
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
        }
      });

      if (!user) {
        console.log('❌ User not found');
        return { success: false, error: 'Invalid credentials' };
      }

      console.log('👤 User found, verifying password...');
      
      // Verify password
      const isValid = await this.verifyPassword(password, user.password);
      
      if (!isValid) {
        console.log('❌ Invalid password');
        return { success: false, error: 'Invalid credentials' };
      }

      console.log('✅ Password valid, creating session...');
      
      // Create session
      const session = await this.createSession(user.id);
      
      console.log('✅ Authentication successful');
      
      return {
        success: true,
        user: {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role
        },
        token: session.token
      };
      
    } catch (error) {
      console.error('❌ Authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }
}