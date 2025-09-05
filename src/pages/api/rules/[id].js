// src/pages/api/rules/[id].js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    switch (req.method) {
      case 'PUT':
        const updatedRule = await prisma.rule.update({
          where: { id },
          data: req.body
        });
        res.status(200).json(updatedRule);
        break;

      case 'DELETE':
        await prisma.rule.delete({
          where: { id }
        });
        res.status(200).json({ message: 'Rule deleted successfully' });
        break;

      case 'GET':
        const rule = await prisma.rule.findUnique({
          where: { id }
        });
        
        if (!rule) {
          return res.status(404).json({ error: 'Rule not found' });
        }
        
        res.status(200).json(rule);
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Rules API error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  } finally {
    await prisma.$disconnect();
  }
}