import { Field, GraphQLISODateTime, ID, ObjectType } from 'type-graphql'
import { UserModel } from './user.model.js'

@ObjectType()
export class CategoryModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => String, { nullable: true })
  color?: string | null

  @Field(() => String)
  userId!: string

  @Field(() => UserModel, { nullable: true })
  user?: UserModel

  @Field(() => Number, { nullable: true })
  transactionCount?: number

  @Field(() => Number, { nullable: true })
  totalAmount?: number

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date
}
