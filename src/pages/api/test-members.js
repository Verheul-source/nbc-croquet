import { Member } from '../../lib/entities/Member'

export default async function handler(req, res) {
  try {
    const members = await Member.list()
    res.status(200).json({ 
      success: true, 
      members: members,
      message: `Found ${members.length} members`
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
}