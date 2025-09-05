// import-rules.js - Simple script to populate your database with rules
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleRules = [
  {
    language: "en",
    part_title: "Preamble",
    part_order: 0,
    section_title: "The Ten Principles of Stichts Croquet",
    section_order: 1,
    content: `Principle 1: Heritage and Tradition
Stichts Croquet draws its noble character from the Victorian tradition of croquet as played in the gardens of English country houses.

Principle 2: Conduct
Players embody the gentlemanly spirit through courteous behaviour, proper deportment, and respectful discourse.

Principle 3: Attire
Players honour tradition through proper dress: white clothing or light earth colours such as sand.`
  },
  {
    language: "en",
    part_title: "Part I: Introduction", 
    part_order: 1,
    section_title: "1. Objective of the Game",
    section_order: 1,
    content: `1.1 The objective of Stichts Croquet is to be the first player to strike the central peg with your ball after successfully completing all required hoops in the correct sequence.

1.2 All players compete as individuals. No partnerships, teams, or alliances are recognised under these Laws.`
  },
  {
    language: "nl",
    part_title: "Preambule",
    part_order: 0, 
    section_title: "De Tien Beginselen van Stichts Croquet",
    section_order: 1,
    content: `Beginsel 1: Erfgoed en Traditie
Stichts Croquet ontleent haar edele karakter aan de Victorian traditie van croquet zoals gespeeld in de tuinen van Engelse landhuizen.

Beginsel 2: Gedrag
Spelers belichamen de geest van hoffelijkheid door wellevend gedrag, gepaste houding en respectvol discours.`
  }
];

async function importRules() {
  try {
    console.log('🚀 Starting rules import...');
    
    // Clear existing rules (optional)
    const existingCount = await prisma.rule.count();
    if (existingCount > 0) {
      console.log(`🗑️ Clearing ${existingCount} existing rules...`);
      await prisma.rule.deleteMany();
    }
    
    // Import new rules
    for (const rule of sampleRules) {
      const created = await prisma.rule.create({ data: rule });
      console.log(`✅ Created rule: ${created.section_title} (${created.language})`);
    }
    
    console.log(`🎉 Successfully imported ${sampleRules.length} rules!`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importRules();