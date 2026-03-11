import { Arg, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql'
import { CategoryModel } from '../models/category.model.js'
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/input/category.input.js'
import { CategoryService } from '../services/category.service.js'
import { GqlUser } from '../graphql/decorators/user.decorator.js'
import { IsAuth } from '../middlewares/auth.middleware.js'
import type { UserModel } from '../models/user.model.js'

@Resolver(() => CategoryModel)
export class CategoryResolver {
  private categoryService = new CategoryService()

  @Query(() => [CategoryModel])
  @UseMiddleware(IsAuth)
  async listCategories(@GqlUser() user: UserModel): Promise<CategoryModel[]> {
    return this.categoryService.listCategories(user.id)
  }

  @Query(() => CategoryModel)
  @UseMiddleware(IsAuth)
  async getCategory(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel
  ): Promise<CategoryModel> {
    return this.categoryService.getCategory(id, user.id)
  }

  @Mutation(() => CategoryModel)
  @UseMiddleware(IsAuth)
  async createCategory(
    @Arg('data', () => CreateCategoryInput) data: CreateCategoryInput,
    @GqlUser() user: UserModel
  ): Promise<CategoryModel> {
    return this.categoryService.createCategory(data, user.id)
  }

  @Mutation(() => CategoryModel)
  @UseMiddleware(IsAuth)
  async updateCategory(
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateCategoryInput) data: UpdateCategoryInput,
    @GqlUser() user: UserModel
  ): Promise<CategoryModel> {
    return this.categoryService.updateCategory(id, data, user.id)
  }

  @Mutation(() => Boolean)
  @UseMiddleware(IsAuth)
  async deleteCategory(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel
  ): Promise<boolean> {
    await this.categoryService.deleteCategory(id, user.id)
    return true
  }

  @FieldResolver(() => Number)
  async transactionCount(@Root() category: CategoryModel): Promise<number> {
    return this.categoryService.countTransactions(category.id)
  }

  @FieldResolver(() => Number)
  async totalAmount(@Root() category: CategoryModel): Promise<number> {
    return this.categoryService.totalAmount(category.id)
  }
}
