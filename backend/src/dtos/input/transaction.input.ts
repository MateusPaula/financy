import { Field, InputType } from 'type-graphql'
import { TransactionType } from '../../models/transaction.model.js'

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  name!: string

  @Field(() => Number)
  amount!: number

  @Field(() => String)
  date!: string

  @Field(() => TransactionType)
  type!: TransactionType

  @Field(() => String)
  categoryId!: string
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => Number, { nullable: true })
  amount?: number

  @Field(() => String, { nullable: true })
  date?: string

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType

  @Field(() => String, { nullable: true })
  categoryId?: string
}
