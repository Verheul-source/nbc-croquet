// create-sample-clubs.js - Create sample clubs for testing
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleClubs = [
  {
    name: "Amsterdam Croquet Club",
    location: "Amsterdam, Netherlands"
  },
  {
    name: "Utrecht Croquet Vereniging", 
    location: "Utrecht, Netherlands"
  },
  {
    name: "Den Haag Croquet Society",
    location: "The Hague, Netherlands"
  },
  {
    name: "Rotterdam Croquet Club",
    location: "Rotterdam, Netherlands"
  },
  {
    name: "Tilburg Croquet Vereniging",
    location: "Tilburg, Netherlands"
  }
];

async function createSampleClubs() {
  try {
    console.log('🏏 Creating sample clubs for Nederlandse Bond der Croquet...\n');
    
    for (const club of sampleClubs) {
      // Check if club already exists
      const existingClub = await prisma.club.findFirst({
        where: { name: club.name }
      });

      if (existingClub) {
        console.log(`⚠️  Club "${club.name}" already exists, skipping...`);
      } else {
        const newClub = await prisma.club.create({
          data: club
        });
        
        console.log(`✅ Created club: ${newClub.name}`);
        console.log(`   Location: ${newClub.location}`);
        console.log(`   ID: ${newClub.id}\n`);
      }
    }
    
    const totalClubs = await prisma.club.count();
    console.log(`🎯 Total clubs in database: ${totalClubs}`);
    console.log('\n✨ Sample clubs creation completed!');
    console.log('You can now add members and assign them to these clubs.');
    
  } catch (error) {
    console.error('❌ Error creating clubs:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Database connection closed.');
  }
}

createSampleClubs();