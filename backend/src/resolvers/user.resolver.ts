import { Arg, Mutation, Resolver, UseMiddleware } from 'type-graphql'
import { UserModel } from '../models/user.model.js'
import { UpdateUserInput } from '../dtos/input/user.input.js'
import { GqlUser } from '../graphql/decorators/user.decorator.js'
import { IsAuth } from '../middlewares/auth.middleware.js'
import { prismaClient } from '../../prisma/prisma.js'

@Resolver(() => UserModel)
export class UserResolver {
  @Mutation(() => UserModel)
  @UseMiddleware(IsAuth)
  async updateUser(
    @Arg('data', () => UpdateUserInput) data: UpdateUserInput,
    @GqlUser() user: UserModel
  ): Promise<UserModel> {
    return prismaClient.user.update({
      where: { id: user.id },
      data,
    })
  }
}
