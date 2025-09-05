// src/pages/api/clubs/[id].js - Dynamic clubs API for individual clubs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        // Get single club with member count
        const club = await prisma.club.findUnique({
          where: { id },
          include: {
            _count: {
              select: {
                members: true
              }
            }
          }
        });
        
        if (!club) {
          return res.status(404).json({ error: 'Club not found' });
        }
        
        res.status(200).json(club);
        break;

      case 'PUT':
        // Update club
        const updatedClub = await prisma.club.update({
          where: { id },
          data: req.body,
          include: {
            _count: {
              select: {
                members: true
              }
            }
          }
        });
        
        res.status(200).json(updatedClub);
        break;

      case 'DELETE':
        // Check if club has members before deleting
        const clubToDelete = await prisma.club.findUnique({
          where: { id },
          include: {
            _count: {
              select: {
                members: true
              }
            }
          }
        });

        if (!clubToDelete) {
          return res.status(404).json({ error: 'Club not found' });
        }

        if (clubToDelete._count.members > 0) {
          return res.status(400).json({ 
            error: `Cannot delete club. It has ${clubToDelete._count.members} member(s). Please reassign or remove members first.` 
          });
        }

        // Delete club
        await prisma.club.delete({
          where: { id }
        });
        
        res.status(200).json({ message: 'Club deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Clubs API error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Club not found' });
    }
    
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
}