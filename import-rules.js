// import-rules.js - Script to populate the rules database
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample rules data - replace with your actual rules
const rulesData = [
  {
    language: "en",
    part_title: "Preamble",
    part_order: 0,
    section_title: "The Ten Principles of Stichts Croquet",
    section_order: 1,
    content: `Principle 1: Heritage and Tradition

Stichts Croquet draws its noble character from the Victorian tradition, maintaining the elegance and sporting spirit that has defined this magnificent game for generations.

Principle 2: Fair Play and Honour
The game shall be conducted with utmost integrity, where a player's word is their bond and sportsmanship supersedes victory.

Principle 3: Precision and Strategy
Every stroke must be executed with deliberate intention, combining tactical acumen with technical mastery.

[Continue with remaining principles...]`
  },
  {
    language: "en",
    part_title: "Basic Rules",
    part_order: 1,
    section_title: "Equipment and Setup",
    section_order: 1,
    content: `The Court:
- Dimensions: 35 yards by 28 yards
- Hoops: 12 hoops arranged in the traditional pattern
- Corner flags marked with Roman numerals I, II, III, IV

Equipment Required:
- Four balls (blue, red, black, yellow)
- Four mallets of appropriate weight and length
- 12 hoops positioned as shown in the court diagram
- One peg (rover peg) positioned at the centre`
  },
  {
    language: "nl",
    part_title: "Voorwoord",
    part_order: 0,
    section_title: "De Tien Principes van Stichts Croquet",
    section_order: 1,
    content: `Principe 1: Erfgoed en Traditie

Stichts Croquet ontleent zijn nobele karakter aan de Victoriaanse traditie en behoudt de elegantie en sportieve geest die dit prachtige spel al generaties lang definieert.

Principe 2: Fair Play en Eer
Het spel wordt gespeeld met de hoogste integriteit, waarbij het woord van een speler hun borg is en sportiviteit boven overwinning gaat.`
  }
];

async function importRules() {
  try {
    console.log('🚀 Starting rules import...');
    
    // Clear existing rules (optional - remove if you want to keep existing data)
    console.log('🗑️ Clearing existing rules...');
    await prisma.rule.deleteMany({});
    
    // Import new rules
    console.log('📚 Importing rules data...');
    
    for (const rule of rulesData) {
      await prisma.rule.create({
        data: rule
      });
      console.log(`✅ Imported: ${rule.section_title} (${rule.language})`);
    }
    
    // Verify import
    const count = await prisma.rule.count();
    console.log(`\n📊 Import completed successfully!`);
    console.log(`📈 Total rules in database: ${count}`);
    
    // Show summary by language
    const englishCount = await prisma.rule.count({ where: { language: 'en' } });
    const dutchCount = await prisma.rule.count({ where: { language: 'nl' } });
    
    console.log(`🇬🇧 English rules: ${englishCount}`);
    console.log(`🇳🇱 Dutch rules: ${dutchCount}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
  }
}

// Execute the import
importRules()
  .then(() => {
    console.log('🎉 Rules import process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error during import:', error);
    process.exit(1);
  });