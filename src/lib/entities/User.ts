import { prisma } from '@/lib/db'

export class User {
  static async me() {
    // For now, return a mock admin user for testing
    // Later you'll replace this with actual authentication
    return {
      id: "admin-user-id",
      role: "admin",
      email: "admin@croquet.nl"
    }
  }

  static async login() {
    // Mock login for testing
    console.log("Login function called")
    return this.me()
  }

  static async create(data: any) {
    return prisma.user.create({ data })
  }

  static async update(id: string, data: any) {
    return prisma.user.update({ where: { id }, data })
  }
}