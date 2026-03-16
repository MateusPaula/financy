import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { Link } from 'react-router-dom'
import {
  Wallet,
  CircleArrowUp,
  CircleArrowDown,
  ChevronRight,
  Plus,
} from 'lucide-react'
import { DashboardHeader } from './dashboard-header'
import { getCategoryStyle, getCategoryIcon } from '../data/categories'
import { NovaTransacaoDialog } from './nova-transacao-dialog'
import { LIST_TRANSACTIONS, TOTAL_BALANCE, MONTHLY_INCOME, MONTHLY_EXPENSES } from '../lib/graphql/queries/transaction.queries'
import { LIST_CATEGORIES } from '../lib/graphql/queries/category.queries'
import type { Transaction, Category } from '../types'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = String(d.getFullYear()).slice(-2)
  return `${day}/${month}/${year}`
}

export function Dashboard() {
  const [showNewTransaction, setShowNewTransaction] = useState(false)

  const { data: balanceData } = useQuery<{ totalBalance: number }>(TOTAL_BALANCE)
  const { data: incomeData } = useQuery<{ monthlyIncome: number }>(MONTHLY_INCOME)
  const { data: expensesData } = useQuery<{ monthlyExpenses: number }>(MONTHLY_EXPENSES)
  const { data: txData } = useQuery<{ listTransactions: Transaction[] }>(LIST_TRANSACTIONS)
  const { data: catData } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES)

  const balance = balanceData?.totalBalance ?? 0
  const income = incomeData?.monthlyIncome ?? 0
  const expenses = expensesData?.monthlyExpenses ?? 0
  const transactions = (txData?.listTransactions ?? []).slice(0, 5)
  const categories = catData?.listCategories ?? []

  return (
    <div className="min-h-dvh bg-gray-100">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="bg-white border border-gray-300 rounded-xl p-5 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Wallet size={20} className="text-green-700 shrink-0" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Saldo Total
              </span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{formatCurrency(balance)}</p>
          </div>

          <div className="bg-white border border-gray-300 rounded-xl p-5 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <CircleArrowUp size={20} className="text-green-600 shrink-0" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Receitas do Mês
              </span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{formatCurrency(income)}</p>
          </div>

          <div className="bg-white border border-gray-300 rounded-xl p-5 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <CircleArrowDown size={20} className="text-red-500 shrink-0" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Despesas do Mês
              </span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{formatCurrency(expenses)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-300 rounded-xl">
            <div className="flex items-center justify-between px-4 md:px-6 pt-5 md:pt-6 pb-3 md:pb-4">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Transações Recentes
              </span>
              <Link
                to="/transacoes"
                className="flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800 hover:underline underline-offset-2 transition-colors cursor-pointer"
              >
                Ver todas
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="px-4 md:px-6">
              {transactions.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">Nenhuma transação</p>
              ) : (
                transactions.map(tx => {
                  const colors = getCategoryStyle(tx.category.name, tx.category.color)
                  const Icon = getCategoryIcon(tx.category.name, tx.category.icon)
                  const isIncome = tx.type === 'INCOME'
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center gap-3 md:gap-4 py-3 md:py-4 border-t border-gray-100"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colors.iconBg}`}>
                        <Icon size={20} className={colors.iconColor} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {tx.name}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                      </div>

                      <span className={`hidden sm:inline text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${colors.badge}`}>
                        {tx.category.name}
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0 justify-end">
                        <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                          {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                        </span>
                        {isIncome ? (
                          <CircleArrowUp size={16} className="text-green-600 shrink-0" />
                        ) : (
                          <CircleArrowDown size={16} className="text-red-500 shrink-0" />
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="px-4 md:px-6 py-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowNewTransaction(true)}
                className="flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800 hover:underline underline-offset-2 transition-colors mx-auto cursor-pointer"
              >
                <Plus size={16} />
                Nova transação
              </button>
            </div>
          </div>

          <div className="lg:col-span-1 bg-white border border-gray-300 rounded-xl">
            <div className="flex items-center justify-between px-4 md:px-6 pt-5 md:pt-6 pb-3 md:pb-4">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Categorias
              </span>
              <Link
                to="/categorias"
                className="flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800 hover:underline underline-offset-2 transition-colors cursor-pointer"
              >
                Gerenciar
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="px-4 md:px-6 pb-5 md:pb-6">
              {categories.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Nenhuma categoria</p>
              ) : (
                categories.map(cat => {
                  const colors = getCategoryStyle(cat.name, cat.color)
                  return (
                    <div key={cat.id} className="flex items-center gap-3 py-3 first:pt-0">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${colors.badge}`}>
                        {cat.name}
                      </span>
                      <span className="text-xs text-gray-500 ml-auto whitespace-nowrap">
                        {cat.transactionCount} itens
                      </span>
                      <span className="text-sm font-semibold text-gray-900 min-w-[80px] text-right">
                        {formatCurrency(cat.totalAmount)}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </main>

      <NovaTransacaoDialog
        open={showNewTransaction}
        onClose={() => setShowNewTransaction(false)}
      />
    </div>
  )
}
