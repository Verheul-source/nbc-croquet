// src/app/api/rules/route.js - Rules API endpoint (App Router)
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Get language from query params
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'en';

    // Try to fetch rules from database
    const rules = await prisma.rule.findMany({
      where: {
        language: language
      },
      orderBy: [
        { part_order: 'asc' },
        { section_order: 'asc' }
      ],
      select: {
        id: true,
        part_title: true,
        part_order: true,
        section_title: true,
        section_order: true,
        content: true,
        language: true
      }
    });

    return NextResponse.json(rules);
  } catch (error) {
    console.error('Rules API error:', error);
    
    // If database error, return empty array (page will use fallback data)
    return NextResponse.json([], { status: 200 });
  }
}