const { Member } = require('./lib/entities/Member')

async function testMember() {
  try {
    const members = await Member.list()
    console.log('Members with club names:', members)
  } catch (error) {
    console.error('Error:', error)
  }
}

testMember()