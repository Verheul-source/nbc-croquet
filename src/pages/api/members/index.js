// src/pages/api/members/index.js - Main members API endpoint
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        // Get all members with club information
        const members = await prisma.member.findMany({
          include: {
            club: true
          },
          orderBy: {
            created_date: 'desc'
          }
        });
        
        // Add club_name to each member for easier access
        const membersWithClubName = members.map(member => ({
          ...member,
          club_name: member.club?.name || 'No Club'
        }));
        
        res.status(200).json(membersWithClubName);
        break;

      case 'POST':
        // Create new member
        const newMember = await prisma.member.create({
          data: {
            ...req.body,
            date_joined: new Date(req.body.date_joined)
          },
          include: {
            club: true
          }
        });
        
        res.status(201).json({
          ...newMember,
          club_name: newMember.club?.name || 'No Club'
        });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Members API error:', error);
    
    // Handle specific errors
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'Membership number already exists. Please use a unique membership number.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
}