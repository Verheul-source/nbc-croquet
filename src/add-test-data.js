const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addTestData() {
  try {
    // Create a club first
    const club = await prisma.club.create({
      data: {
        name: "Test Croquet Club",
        location: "Amsterdam"
      }
    })
    
    console.log('Created club:', club)
    
    // Create a member linked to that club
    const member = await prisma.member.create({
      data: {
        full_name: "Jan de Vries",
        club_id: club.id,
        membership_number: "001",
        date_joined: new Date('2024-01-15'),
        membership_type: "full",
        handicap: 0
      }
    })
    
    console.log('Created member:', member)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addTestData()