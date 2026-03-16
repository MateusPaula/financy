import { gql } from '@apollo/client'

export const LIST_TRANSACTIONS = gql`
  query ListTransactions {
    listTransactions {
      id
      name
      amount
      date
      type
      categoryId
      category {
        id
        name
        color
        icon
      }
    }
  }
`

export const TOTAL_BALANCE = gql`
  query TotalBalance {
    totalBalance
  }
`

export const MONTHLY_INCOME = gql`
  query MonthlyIncome {
    monthlyIncome
  }
`

export const MONTHLY_EXPENSES = gql`
  query MonthlyExpenses {
    monthlyExpenses
  }
`
