import { prismaClient } from '../../prisma/prisma.js'
import type { CreateTransactionInput, UpdateTransactionInput } from '../dtos/input/transaction.input.js'

export class TransactionService {
  async createTransaction(data: CreateTransactionInput, userId: string) {
    return prismaClient.transaction.create({
      data: {
        name: data.name,
        amount: data.amount,
        date: new Date(data.date),
        type: data.type,
        categoryId: data.categoryId,
        userId,
      },
    })
  }

  async listTransactions(userId: string) {
    return prismaClient.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    })
  }

  async getTransaction(id: string, userId: string) {
    const transaction = await prismaClient.transaction.findUnique({ where: { id } })

    if (!transaction || transaction.userId !== userId) {
      throw new Error('Transação não encontrada')
    }

    return transaction
  }

  async updateTransaction(id: string, data: UpdateTransactionInput, userId: string) {
    const transaction = await prismaClient.transaction.findUnique({ where: { id } })

    if (!transaction || transaction.userId !== userId) {
      throw new Error('Transação não encontrada')
    }

    return prismaClient.transaction.update({
      where: { id },
      data: {
        name: data.name,
        amount: data.amount,
        date: data.date ? new Date(data.date) : undefined,
        type: data.type,
        categoryId: data.categoryId,
      },
    })
  }

  async deleteTransaction(id: string, userId: string) {
    const transaction = await prismaClient.transaction.findUnique({ where: { id } })

    if (!transaction || transaction.userId !== userId) {
      throw new Error('Transação não encontrada')
    }

    return prismaClient.transaction.delete({ where: { id } })
  }

  async getTotalBalance(userId: string) {
    const income = await prismaClient.transaction.aggregate({
      where: { userId, type: 'INCOME' },
      _sum: { amount: true },
    })

    const expenses = await prismaClient.transaction.aggregate({
      where: { userId, type: 'EXPENSE' },
      _sum: { amount: true },
    })

    return (income._sum.amount || 0) - (expenses._sum.amount || 0)
  }

  async getMonthlyIncome(userId: string) {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const result = await prismaClient.transaction.aggregate({
      where: { userId, type: 'INCOME', date: { gte: startOfMonth } },
      _sum: { amount: true },
    })

    return result._sum.amount || 0
  }

  async getMonthlyExpenses(userId: string) {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const result = await prismaClient.transaction.aggregate({
      where: { userId, type: 'EXPENSE', date: { gte: startOfMonth } },
      _sum: { amount: true },
    })

    return result._sum.amount || 0
  }
}
