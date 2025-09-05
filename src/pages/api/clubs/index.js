// src/pages/api/clubs/index.js - Clubs API endpoint
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        // Get all clubs with member count
        const clubs = await prisma.club.findMany({
          include: {
            _count: {
              select: {
                members: true
              }
            }
          },
          orderBy: {
            name: 'asc'
          }
        });
        
        res.status(200).json(clubs);
        break;

      case 'POST':
        // Create new club
        const newClub = await prisma.club.create({
          data: req.body,
          include: {
            _count: {
              select: {
                members: true
              }
            }
          }
        });
        
        res.status(201).json(newClub);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Clubs API error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
}