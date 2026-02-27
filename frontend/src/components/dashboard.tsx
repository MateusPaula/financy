import {
  Wallet,
  CircleArrowUp,
  CircleArrowDown,
  Utensils,
  Fuel,
  ShoppingCart,
  PiggyBank,
  ChevronRight,
  Plus,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DashboardHeader } from './dashboard-header'

type CategoryColor = {
  badge: string
  iconBg: string
  iconColor: string
}

const categoryColors: Record<string, CategoryColor> = {
  Receita: {
    badge: 'bg-green-100 text-green-700',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-700',
  },
  Alimentação: {
    badge: 'bg-yellow-100 text-yellow-700',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-700',
  },
  Transporte: {
    badge: 'bg-red-100 text-red-700',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-700',
  },
  Mercado: {
    badge: 'bg-orange-100 text-orange-700',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-700',
  },
  Investimento: {
    badge: 'bg-emerald-100 text-emerald-700',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-700',
  },
  Entretenimento: {
    badge: 'bg-pink-100 text-pink-700',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-700',
  },
  Utilidades: {
    badge: 'bg-gray-100 text-gray-600',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
  },
}

type Transaction = {
  name: string
  date: string
  category: string
  amount: string
  type: 'income' | 'expense'
  icon: LucideIcon
}

const transactions: Transaction[] = [
  {
    name: 'Pagamento de Salário',
    date: '01/12/25',
    category: 'Receita',
    amount: 'R$ 4.250,00',
    type: 'income',
    icon: Wallet,
  },
  {
    name: 'Jantar no Restaurante',
    date: '30/11/25',
    category: 'Alimentação',
    amount: 'R$ 89,50',
    type: 'expense',
    icon: Utensils,
  },
  {
    name: 'Posto de Gasolina',
    date: '29/11/25',
    category: 'Transporte',
    amount: 'R$ 100,00',
    type: 'expense',
    icon: Fuel,
  },
  {
    name: 'Compras no Mercado',
    date: '28/11/25',
    category: 'Mercado',
    amount: 'R$ 156,80',
    type: 'expense',
    icon: ShoppingCart,
  },
  {
    name: 'Retorno de Investimento',
    date: '26/11/25',
    category: 'Investimento',
    amount: 'R$ 340,25',
    type: 'income',
    icon: PiggyBank,
  },
]

type Category = {
  name: string
  items: number
  total: string
}

const categories: Category[] = [
  { name: 'Alimentação', items: 12, total: 'R$ 542,30' },
  { name: 'Transporte', items: 8, total: 'R$ 385,50' },
  { name: 'Mercado', items: 3, total: 'R$ 298,75' },
  { name: 'Entretenimento', items: 2, total: 'R$ 186,20' },
  { name: 'Utilidades', items: 7, total: 'R$ 245,80' },
]

export function Dashboard() {
  return (
    <div className="min-h-dvh bg-gray-100">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="bg-white border border-gray-300 rounded-xl p-5 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Wallet size={20} className="text-green-700 shrink-0" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Saldo Total
              </span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900">R$ 12.847,32</p>
          </div>

          <div className="bg-white border border-gray-300 rounded-xl p-5 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <CircleArrowUp size={20} className="text-green-600 shrink-0" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Receitas do Mês
              </span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900">R$ 4.250,00</p>
          </div>

          <div className="bg-white border border-gray-300 rounded-xl p-5 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <CircleArrowDown size={20} className="text-red-500 shrink-0" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Despesas do Mês
              </span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900">R$ 2.180,45</p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Recent transactions */}
          <div className="lg:col-span-2 bg-white border border-gray-300 rounded-xl">
            <div className="flex items-center justify-between px-4 md:px-6 pt-5 md:pt-6 pb-3 md:pb-4">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Transações Recentes
              </span>
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
              >
                Ver todas
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="px-4 md:px-6">
              {transactions.map(tx => {
                const colors = categoryColors[tx.category]
                const Icon = tx.icon
                return (
                  <div
                    key={tx.name}
                    className="flex items-center gap-3 md:gap-4 py-3 md:py-4 border-t border-gray-100"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colors.iconBg}`}
                    >
                      <Icon size={20} className={colors.iconColor} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {tx.name}
                      </p>
                      <p className="text-xs text-gray-500">{tx.date}</p>
                    </div>

                    <span
                      className={`hidden sm:inline text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${colors.badge}`}
                    >
                      {tx.category}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0 justify-end">
                      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {tx.type === 'income' ? '+' : '-'} {tx.amount}
                      </span>
                      {tx.type === 'income' ? (
                        <CircleArrowUp size={16} className="text-green-600 shrink-0" />
                      ) : (
                        <CircleArrowDown size={16} className="text-red-500 shrink-0" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="px-4 md:px-6 py-4 border-t border-gray-100">
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800 transition-colors mx-auto"
              >
                <Plus size={16} />
                Nova transação
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="lg:col-span-1 bg-white border border-gray-300 rounded-xl">
            <div className="flex items-center justify-between px-4 md:px-6 pt-5 md:pt-6 pb-3 md:pb-4">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Categorias
              </span>
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
              >
                Gerenciar
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="px-4 md:px-6 pb-5 md:pb-6">
              {categories.map(cat => {
                const colors = categoryColors[cat.name]
                return (
                  <div
                    key={cat.name}
                    className="flex items-center gap-3 py-3 first:pt-0"
                  >
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${colors.badge}`}
                    >
                      {cat.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto whitespace-nowrap">
                      {cat.items} itens
                    </span>
                    <span className="text-sm font-semibold text-gray-900 min-w-[80px] text-right">
                      {cat.total}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
