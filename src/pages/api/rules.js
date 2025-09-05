import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const rules = await prisma.rule.findMany({
        orderBy: [
          { part_order: 'asc' },
          { section_order: 'asc' }
        ]
      });
      res.status(200).json(rules);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch rules' });
    }
  }
}