// src/lib/auth.js - Authentication Service
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

export class AuthService {
  // Authenticate user with email and password
  static async authenticate(email, password) {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          password: true
        }
      });

      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Create session token
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      // Store session in database
      await prisma.session.create({
        data: {
          token,
          user_id: user.id,
          expires_at: expiresAt
        }
      });

      // Return user data (without password)
      const { password: _, ...userData } = user;
      
      return {
        success: true,
        token,
        user: userData
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  // Get session and user data
  static async getSession(token) {
    try {
      const session = await prisma.session.findUnique({
        where: { token },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true
            }
          }
        }
      });

      if (!session) {
        return null;
      }

      // Check if session is expired
      if (session.expires_at < new Date()) {
        // Delete expired session
        await prisma.session.delete({
          where: { token }
        });
        return null;
      }

      // Update last activity
      await prisma.session.update({
        where: { token },
        data: { last_activity: new Date() }
      });

      return session;
    } catch (error) {
      console.error('Session lookup error:', error);
      return null;
    }
  }

  // Delete session (logout)
  static async deleteSession(token) {
    try {
      await prisma.session.delete({
        where: { token }
      });
      return true;
    } catch (error) {
      console.error('Session deletion error:', error);
      return false;
    }
  }

  // Create a new user (for admin purposes)
  static async createUser(email, password, role = 'member') {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          role
        },
        select: {
          id: true,
          email: true,
          role: true,
          created_date: true
        }
      });

      return { success: true, user };
    } catch (error) {
      console.error('User creation error:', error);
      if (error.code === 'P2002') {
        return { success: false, error: 'Email already exists' };
      }
      return { success: false, error: 'Failed to create user' };
    }
  }

  // Cleanup expired sessions
  static async cleanupExpiredSessions() {
    try {
      const result = await prisma.session.deleteMany({
        where: {
          expires_at: {
            lt: new Date()
          }
        }
      });
      console.log(`Cleaned up ${result.count} expired sessions`);
      return result.count;
    } catch (error) {
      console.error('Session cleanup error:', error);
      return 0;
    }
  }
}

// Close Prisma connection on process exit
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});