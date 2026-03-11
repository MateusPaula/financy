import { prismaClient } from '../../prisma/prisma.js'
import type { CreateCategoryInput, UpdateCategoryInput } from '../dtos/input/category.input.js'

export class CategoryService {
  async createCategory(data: CreateCategoryInput, userId: string) {
    return prismaClient.category.create({
      data: { name: data.name, color: data.color, userId },
    })
  }

  async listCategories(userId: string) {
    return prismaClient.category.findMany({
      where: { userId },
    })
  }

  async getCategory(id: string, userId: string) {
    const category = await prismaClient.category.findUnique({ where: { id } })

    if (!category || category.userId !== userId) {
      throw new Error('Categoria não encontrada')
    }

    return category
  }

  async updateCategory(id: string, data: UpdateCategoryInput, userId: string) {
    const category = await prismaClient.category.findUnique({ where: { id } })

    if (!category || category.userId !== userId) {
      throw new Error('Categoria não encontrada')
    }

    return prismaClient.category.update({
      where: { id },
      data: { name: data.name, color: data.color },
    })
  }

  async deleteCategory(id: string, userId: string) {
    const category = await prismaClient.category.findUnique({ where: { id } })

    if (!category || category.userId !== userId) {
      throw new Error('Categoria não encontrada')
    }

    return prismaClient.category.delete({ where: { id } })
  }

  async countTransactions(categoryId: string) {
    return prismaClient.transaction.count({ where: { categoryId } })
  }

  async totalAmount(categoryId: string) {
    const result = await prismaClient.transaction.aggregate({
      where: { categoryId },
      _sum: { amount: true },
    })

    return result._sum.amount || 0
  }
}
