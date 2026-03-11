import { Field, GraphQLISODateTime, ID, ObjectType, registerEnumType } from 'type-graphql'
import { CategoryModel } from './category.model.js'

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

registerEnumType(TransactionType, {
  name: 'TransactionType',
})

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => Number)
  amount!: number

  @Field(() => GraphQLISODateTime)
  date!: Date

  @Field(() => TransactionType)
  type!: TransactionType

  @Field(() => String)
  userId!: string

  @Field(() => String)
  categoryId!: string

  @Field(() => CategoryModel, { nullable: true })
  category?: CategoryModel

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date
}
