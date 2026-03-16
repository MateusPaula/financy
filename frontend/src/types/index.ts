export interface User {
  id: string
  name: string
  email: string
}

export interface AuthOutput {
  token: string
  user: User
}

export interface Category {
  id: string
  name: string
  color: string | null
  icon: string | null
  description: string | null
  transactionCount: number
  totalAmount: number
}

export interface Transaction {
  id: string
  name: string
  amount: number
  date: string
  type: 'INCOME' | 'EXPENSE'
  categoryId: string
  category: {
    id: string
    name: string
    color: string | null
    icon: string | null
  }
}
