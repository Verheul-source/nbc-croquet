import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// This will show us what types are available
type MemberType = Awaited<ReturnType<typeof prisma.member.findFirst>>
type ClubType = Awaited<ReturnType<typeof prisma.club.findFirst>>