const { Member } = require('./lib/entities/Member')

async function testMemberList() {
  try {
    const members = await Member.list()
    console.log('Members with club data:')
    members.forEach(member => {
      console.log(`- ${member.full_name} belongs to: ${member.club_name}`)
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

testMemberList()