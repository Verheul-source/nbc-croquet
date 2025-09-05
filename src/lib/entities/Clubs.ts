import { prisma } from '@/lib/db'

export class Club {
  static async list(orderBy?: string) {
    return prisma.club.findMany({
      orderBy: orderBy?.startsWith('-') 
        ? { [orderBy.slice(1)]: 'desc' }
        : orderBy ? { [orderBy]: 'asc' } : undefined
    })
  }

  static async create(data: any) {
    return prisma.club.create({ data })
  }

  static async update(id: string, data: any) {
    return prisma.club.update({ where: { id }, data })
  }

  static async delete(id: string) {
    return prisma.club.delete({ where: { id } })
  }

  static async findById(id: string) {
    return prisma.club.findUnique({ where: { id } })
  }
}