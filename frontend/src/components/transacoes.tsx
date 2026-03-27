import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import {
  Plus,
  Search,
  CircleArrowUp,
  CircleArrowDown,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { DashboardHeader } from './dashboard-header'
import { getCategoryStyle, getCategoryIcon } from '../data/categories'
import { NovaTransacaoDialog } from './nova-transacao-dialog'
import { LIST_TRANSACTIONS, TOTAL_BALANCE, MONTHLY_INCOME, MONTHLY_EXPENSES } from '../lib/graphql/queries/transaction.queries'
import { LIST_CATEGORIES } from '../lib/graphql/queries/category.queries'
import { DELETE_TRANSACTION } from '../lib/graphql/mutations/transaction.mutations'
import type { Transaction, Category } from '../types'

const ITEMS_PER_PAGE = 10

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

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function getPeriodKey(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function formatPeriod(key: string) {
  const [year, month] = key.split('-')
  return `${monthNames[parseInt(month, 10) - 1]} / ${year}`
}

export function Transacoes() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showNewTransaction, setShowNewTransaction] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const { data, loading: queryLoading } = useQuery<{ listTransactions: Transaction[] }>(LIST_TRANSACTIONS)
  const { data: categoriesData } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES)
  const allTransactions = data?.listTransactions ?? []
  const categoryList = categoriesData?.listCategories ?? []

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: [
      { query: LIST_TRANSACTIONS },
      { query: TOTAL_BALANCE },
      { query: MONTHLY_INCOME },
      { query: MONTHLY_EXPENSES },
      { query: LIST_CATEGORIES },
    ],
    onCompleted: () => toast.success('Transação excluída'),
    onError: (error) => toast.error(error.message),
  })

  const filtered = allTransactions.filter(tx => {
    if (searchQuery && !tx.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (typeFilter === 'income' && tx.type !== 'INCOME') return false
    if (typeFilter === 'expense' && tx.type !== 'EXPENSE') return false
    if (categoryFilter !== 'all' && tx.category.name !== categoryFilter) return false
    if (periodFilter !== 'all' && getPeriodKey(tx.date) !== periodFilter) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  const showFrom = filtered.length > 0 ? startIndex + 1 : 0
  const showTo = Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)

  function handleFilterChange<T>(setter: React.Dispatch<React.SetStateAction<T>>) {
    return (value: T) => {
      setter(value)
      setCurrentPage(1)
    }
  }

  function handleDelete(id: string) {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransaction({ variables: { id } })
    }
  }

  function getPageNumbers(): (number | '...')[] {
    const pages: (number | '...')[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (safePage > 3) pages.push('...')
      const start = Math.max(2, safePage - 1)
      const end = Math.min(totalPages - 1, safePage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (safePage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  const categoryNames = categoryList.map(c => c.name)

  const periodOptions = [...new Set(allTransactions.map(tx => getPeriodKey(tx.date)))].sort().reverse()

  return (
    <div className="min-h-dvh bg-gray-100">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transações</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gerencie todas as suas transações financeiras
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNewTransaction(true)}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors self-start sm:self-auto"
          >
            <Plus size={18} />
            Nova transação
          </button>
        </div>

        <div className="bg-white border border-gray-300 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Buscar
              </label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por descrição"
                  value={searchQuery}
                  onChange={e => handleFilterChange(setSearchQuery)(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tipo
              </label>
              <select
                value={typeFilter}
                onChange={e => handleFilterChange(setTypeFilter)(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
              >
                <option value="all">Todos</option>
                <option value="income">Entrada</option>
                <option value="expense">Saída</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Categoria
              </label>
              <select
                value={categoryFilter}
                onChange={e => handleFilterChange(setCategoryFilter)(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
              >
                <option value="all">Todas</option>
                {categoryNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Período
              </label>
              <select
                value={periodFilter}
                onChange={e => handleFilterChange(setPeriodFilter)(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
              >
                <option value="all">Todos</option>
                {periodOptions.map((key) => (
                  <option key={key} value={key}>
                    {formatPeriod(key)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-xl">
          {queryLoading ? (
            <p className="text-gray-500 text-center py-12">Carregando...</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 md:px-6 py-4">
                        Descrição
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-4">
                        Data
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-4">
                        Categoria
                      </th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-4">
                        Tipo
                      </th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-4">
                        Valor
                      </th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 md:px-6 py-4">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map(tx => {
                      const colors = getCategoryStyle(tx.category.name, tx.category.color)
                      const Icon = getCategoryIcon(tx.category.name, tx.category.icon)
                      const isIncome = tx.type === 'INCOME'
                      return (
                        <tr key={tx.id} className="border-b border-gray-100 last:border-b-0">
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colors.iconBg}`}>
                                <Icon size={20} className={colors.iconColor} />
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {tx.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {formatDate(tx.date)}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${colors.badge}`}>
                              {tx.category.name}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5">
                              {isIncome ? (
                                <CircleArrowUp size={16} className="text-green-600 shrink-0" />
                              ) : (
                                <CircleArrowDown size={16} className="text-red-500 shrink-0" />
                              )}
                              <span className={`text-sm ${isIncome ? 'text-green-600' : 'text-red-500'}`}>
                                {isIncome ? 'Entrada' : 'Saída'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                              {isIncome ? '+ ' : '- '}{formatCurrency(tx.amount)}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleDelete(tx.id)}
                                className="p-1.5 text-red-500 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors"
                                title="Excluir"
                              >
                                <Trash2 size={18} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingTransaction(tx)}
                                className="p-1.5 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                title="Editar"
                              >
                                <Pencil size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-4 border-t border-gray-200 gap-3">
                <span className="text-sm text-green-700">
                  {showFrom} a {showTo} | {filtered.length} resultados
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {getPageNumbers().map((page, i) =>
                    page === '...' ? (
                      <span
                        key={`ellipsis-${i}`}
                        className="w-9 h-9 flex items-center justify-center text-sm text-gray-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          safePage === page
                            ? 'bg-green-700 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <NovaTransacaoDialog
        open={showNewTransaction || !!editingTransaction}
        onClose={() => {
          setShowNewTransaction(false)
          setEditingTransaction(null)
        }}
        transaction={editingTransaction}
      />
    </div>
  )
}
