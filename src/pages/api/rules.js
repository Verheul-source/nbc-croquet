// src/pages/api/rules.js - FIXED VERSION with proper error handling
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  console.log('📡 API /rules called with method:', req.method);
  
  if (req.method === 'GET') {
    try {
      console.log('🔍 Fetching rules from database...');
      
      // Test database connection first
      await prisma.$connect();
      console.log('✅ Database connected');
      
      const rules = await prisma.rule.findMany({
        orderBy: [
          { part_order: 'asc' },
          { section_order: 'asc' }
        ]
      });
      
      console.log(`📊 Found ${rules.length} rules`);
      
      // Always return an array, even if empty
      res.status(200).json(rules || []);
      
    } catch (error) {
      console.error('❌ API Error:', error);
      
      // Provide detailed error information
      if (error.code === 'P2021') {
        return res.status(500).json({ 
          error: 'Rule table does not exist. Run: npx prisma migrate dev',
          code: 'TABLE_NOT_FOUND'
        });
      }
      
      if (error.code === 'P1001') {
        return res.status(500).json({ 
          error: 'Cannot reach database. Check your DATABASE_URL',
          code: 'DATABASE_UNREACHABLE'
        });
      }
      
      // Generic error
      res.status(500).json({ 
        error: 'Failed to fetch rules',
        details: error.message,
        code: error.code || 'UNKNOWN_ERROR'
      });
      
    } finally {
      await prisma.$disconnect();
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}