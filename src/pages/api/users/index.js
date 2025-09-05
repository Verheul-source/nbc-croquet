// src/pages/api/users/index.js - Users API endpoint for admin
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    // Only allow GET requests for security
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get all users (excluding passwords for security)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        created_date: true,
        member: {
          select: {
            id: true,
            full_name: true
          }
        }
      },
      orderBy: {
        email: 'asc'
      }
    });
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Users API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch users',
      details: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
}