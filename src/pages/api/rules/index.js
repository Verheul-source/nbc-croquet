// src/pages/api/rules/index.js - Updated with subsection ordering
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        const rules = await prisma.rule.findMany({
          orderBy: [
            { part_order: 'asc' },
            { section_order: 'asc' },
            { subsection_order: 'asc' }
          ]
        });
        res.status(200).json(rules);
        break;

      case 'POST':
        const newRule = await prisma.rule.create({
          data: req.body
        });
        res.status(201).json(newRule);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Rules API error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  } finally {
    await prisma.$disconnect();
  }
}