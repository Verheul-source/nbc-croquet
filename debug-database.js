// debug-database.js - Test database connection and check users
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if users exist
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        created_date: true
      }
    });
    
    console.log(`📊 Found ${users.length} users in database:`);
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role}) - ID: ${user.id}`);
    });
    
    // Check if sessions table exists
    const sessionCount = await prisma.session.count();
    console.log(`📊 Found ${sessionCount} sessions in database`);
    
    // Test password verification for admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@croquet.nl' }
    });
    
    if (adminUser) {
      console.log('✅ Admin user found in database');
      console.log('   Password hash exists:', !!adminUser.password);
    } else {
      console.log('❌ Admin user not found in database');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
  }
}

debugDatabase();