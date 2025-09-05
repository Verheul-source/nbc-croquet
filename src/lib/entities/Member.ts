import { prisma } from '@/lib/db'

export class Member {
  static async list(orderBy?: string) {
    const members = await prisma.member.findMany({
      include: {
        club: true
      },
      orderBy: orderBy?.startsWith('-') 
        ? { [orderBy.slice(1)]: 'desc' }
        : orderBy ? { [orderBy]: 'asc' } : undefined
    })
    
    return members.map((m: any) => ({
      ...m,
      club_name: m.club.name
    }))
  }

  static async create(data: any) {
    return prisma.member.create({ data })
  }

  static async update(id: string, data: any) {
    return prisma.member.update({ where: { id }, data })
  }

  static async delete(id: string) {
    return prisma.member.delete({ where: { id } })
  }
}