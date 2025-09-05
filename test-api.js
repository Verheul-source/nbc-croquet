// test-api.js - Run this to test your API endpoints
// Place this in your project root and run with: node test-api.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check if Rule table exists and has data
    const ruleCount = await prisma.rule.count();
    console.log(`📊 Found ${ruleCount} rules in database`);
    
    if (ruleCount === 0) {
      console.log('⚠️ No rules found in database - this explains the API error');
      console.log('💡 You need to import rules into your database first');
    } else {
      // Show sample rules
      const sampleRules = await prisma.rule.findMany({
        take: 3,
        select: {
          id: true,
          language: true,
          part_title: true,
          section_title: true
        }
      });
      console.log('📋 Sample rules:', sampleRules);
    }
    
    // Test other tables
    const clubCount = await prisma.club.count();
    const memberCount = await prisma.member.count();
    const userCount = await prisma.user.count();
    
    console.log(`📊 Database summary:`);
    console.log(`   - Rules: ${ruleCount}`);
    console.log(`   - Clubs: ${clubCount}`);
    console.log(`   - Members: ${memberCount}`);
    console.log(`   - Users: ${userCount}`);
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    
    if (error.code === 'P2021') {
      console.log('💡 The "rule" table does not exist. Run: npx prisma migrate dev');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Test your API endpoint directly
async function testAPIEndpoint() {
  try {
    console.log('\n🌐 Testing API endpoint...');
    
    // This simulates what your rules page does
    const response = await fetch('http://localhost:3000/api/rules');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API endpoint working:', data.length, 'rules returned');
    } else {
      console.log('❌ API endpoint failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Cannot reach API endpoint:', error.message);
    console.log('💡 Make sure your Next.js dev server is running (npm run dev)');
  }
}

// Run tests
testDatabase().then(() => {
  testAPIEndpoint();
});