import { Member } from '@/lib/entities/Member'

export default async function handler(req, res) {
  try {
    const members = await Member.list("-created_date")
    res.status(200).json(members)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}