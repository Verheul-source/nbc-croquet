// src/pages/api/members/[id].js - Dynamic members API for individual members
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        // Get single member
        const member = await prisma.member.findUnique({
          where: { id },
          include: {
            club: true
          }
        });
        
        if (!member) {
          return res.status(404).json({ error: 'Member not found' });
        }
        
        res.status(200).json({
          ...member,
          club_name: member.club?.name || 'No Club'
        });
        break;

      case 'PUT':
        // Update member
        const updatedMember = await prisma.member.update({
          where: { id },
          data: {
            ...req.body,
            date_joined: req.body.date_joined ? new Date(req.body.date_joined) : undefined
          },
          include: {
            club: true
          }
        });
        
        res.status(200).json({
          ...updatedMember,
          club_name: updatedMember.club?.name || 'No Club'
        });
        break;

      case 'DELETE':
        // Delete member
        await prisma.member.delete({
          where: { id }
        });
        
        res.status(200).json({ message: 'Member deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Members API error:', error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'Membership number already exists. Please use a unique membership number.' 
      });
    }
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
}