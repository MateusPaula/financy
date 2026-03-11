import { Arg, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql'
import { TransactionModel } from '../models/transaction.model.js'
import { CreateTransactionInput, UpdateTransactionInput } from '../dtos/input/transaction.input.js'
import { TransactionService } from '../services/transaction.service.js'
import { CategoryService } from '../services/category.service.js'
import { GqlUser } from '../graphql/decorators/user.decorator.js'
import { IsAuth } from '../middlewares/auth.middleware.js'
import type { UserModel } from '../models/user.model.js'
import type { CategoryModel } from '../models/category.model.js'

@Resolver(() => TransactionModel)
export class TransactionResolver {
  private transactionService = new TransactionService()
  private categoryService = new CategoryService()

  @Query(() => [TransactionModel])
  @UseMiddleware(IsAuth)
  async listTransactions(@GqlUser() user: UserModel): Promise<TransactionModel[]> {
    return this.transactionService.listTransactions(user.id)
  }

  @Query(() => TransactionModel)
  @UseMiddleware(IsAuth)
  async getTransaction(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel
  ): Promise<TransactionModel> {
    return this.transactionService.getTransaction(id, user.id)
  }

  @Query(() => Number)
  @UseMiddleware(IsAuth)
  async totalBalance(@GqlUser() user: UserModel): Promise<number> {
    return this.transactionService.getTotalBalance(user.id)
  }

  @Query(() => Number)
  @UseMiddleware(IsAuth)
  async monthlyIncome(@GqlUser() user: UserModel): Promise<number> {
    return this.transactionService.getMonthlyIncome(user.id)
  }

  @Query(() => Number)
  @UseMiddleware(IsAuth)
  async monthlyExpenses(@GqlUser() user: UserModel): Promise<number> {
    return this.transactionService.getMonthlyExpenses(user.id)
  }

  @Mutation(() => TransactionModel)
  @UseMiddleware(IsAuth)
  async createTransaction(
    @Arg('data', () => CreateTransactionInput) data: CreateTransactionInput,
    @GqlUser() user: UserModel
  ): Promise<TransactionModel> {
    return this.transactionService.createTransaction(data, user.id)
  }

  @Mutation(() => TransactionModel)
  @UseMiddleware(IsAuth)
  async updateTransaction(
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateTransactionInput) data: UpdateTransactionInput,
    @GqlUser() user: UserModel
  ): Promise<TransactionModel> {
    return this.transactionService.updateTransaction(id, data, user.id)
  }

  @Mutation(() => Boolean)
  @UseMiddleware(IsAuth)
  async deleteTransaction(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel
  ): Promise<boolean> {
    await this.transactionService.deleteTransaction(id, user.id)
    return true
  }

  @FieldResolver(() => CategoryModel)
  async category(@Root() transaction: TransactionModel): Promise<CategoryModel> {
    return this.categoryService.getCategory(transaction.categoryId, transaction.userId)
  }
}
