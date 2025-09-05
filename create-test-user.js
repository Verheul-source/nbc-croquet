// create-test-user.js - ES Module version for creating test users
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🏏 Creating test users for Nederlandse Bond der Croquet...\n');
    
    // Hash the passwords
    const adminPassword = await bcrypt.hash('admin123', 12);
    const memberPassword = await bcrypt.hash('member123', 12);
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@croquet.nl' }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
    } else {
      // Create admin user
      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@croquet.nl',
          password: adminPassword,
          role: 'admin'
        }
      });
      
      console.log('✅ Test admin user created successfully!');
      console.log('   Email: admin@croquet.nl');
      console.log('   Password: admin123');
      console.log('   Role: admin');
      console.log('   ID:', adminUser.id);
    }
    
    // Check if member user already exists
    const existingMember = await prisma.user.findUnique({
      where: { email: 'member@croquet.nl' }
    });

    if (existingMember) {
      console.log('\n⚠️  Member user already exists!');
    } else {
      // Create member user
      const memberUser = await prisma.user.create({
        data: {
          email: 'member@croquet.nl',
          password: memberPassword,
          role: 'member'
        }
      });
      
      console.log('\n✅ Test member user created successfully!');
      console.log('   Email: member@croquet.nl');
      console.log('   Password: member123');
      console.log('   Role: member');
      console.log('   ID:', memberUser.id);
    }
    
    console.log('\n🎯 Authentication system ready! You can now:');
    console.log('   1. Visit /login to test authentication');
    console.log('   2. Use admin credentials to access admin panel');
    console.log('   3. Use member credentials for standard access');
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  User with this email already exists');
    } else {
      console.error('❌ Error creating user:', error.message);
      console.error('Full error:', error);
    }
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Database connection closed.');
  }
}

createTestUser();