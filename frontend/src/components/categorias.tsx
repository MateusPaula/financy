import { useState } from 'react'
import {
  Plus,
  Tag,
  ArrowUpDown,
  Trash2,
  Pencil,
} from 'lucide-react'
import { DashboardHeader } from './dashboard-header'
import { categories, getCategoryStyle, getCategoryIcon } from '../data/categories'
import { NovaCategoriaDialog } from './nova-categoria-dialog'

type CategorySummary = {
  name: string
  items: number
}

const categorySummaries: CategorySummary[] = [
  { name: 'Alimentação', items: 12 },
  { name: 'Entretenimento', items: 2 },
  { name: 'Investimento', items: 1 },
  { name: 'Mercado', items: 3 },
  { name: 'Salário', items: 3 },
  { name: 'Saúde', items: 0 },
  { name: 'Transporte', items: 8 },
  { name: 'Utilidades', items: 7 },
]

const totalTransactions = categorySummaries.reduce((sum, c) => sum + c.items, 0)

const mostUsedCategory = categorySummaries.reduce((max, c) =>
  c.items > max.items ? c : max,
  categorySummaries[0],
)

export function Categorias() {
  const [showNewCategory, setShowNewCategory] = useState(false)
  const MostUsedIcon = getCategoryIcon(mostUsedCategory.name)
  const mostUsedStyle = getCategoryStyle(mostUsedCategory.name)

  return (
    <div className="min-h-dvh bg-gray-100">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
            <p className="text-sm text-gray-500 mt-1">
              Organize suas transações por categorias
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNewCategory(true)}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors self-start sm:self-auto"
          >
            <Plus size={18} />
            Nova categoria
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="bg-white border border-gray-300 rounded-xl p-5 md:p-6">
            <div className="flex items-center gap-3">
              <Tag size={24} className="text-gray-500 shrink-0" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Total de categorias
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-xl p-5 md:p-6">
            <div className="flex items-center gap-3">
              <ArrowUpDown size={24} className="text-gray-500 shrink-0" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Total de transações
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded-xl p-5 md:p-6">
            <div className="flex items-center gap-3">
              <MostUsedIcon size={24} className={`${mostUsedStyle.iconColor} shrink-0`} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{mostUsedCategory.name}</p>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Categoria mais utilizada
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categorySummaries.map(catSummary => {
            const cat = categories.find(c => c.name === catSummary.name)
            if (!cat) return null
            const Icon = cat.icon
            const colors = cat.style

            return (
              <div
                key={cat.name}
                className="bg-white border border-gray-300 rounded-xl p-5"
              >
                {/* Top row: icon + actions */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colors.iconBg}`}
                  >
                    <Icon size={20} className={colors.iconColor} />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="p-1.5 text-red-500 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                </div>

                {/* Name + description */}
                <h3 className="text-sm font-semibold text-gray-900">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5 mb-4">{cat.description}</p>

                {/* Footer: badge + count */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${colors.badge}`}
                  >
                    {cat.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {catSummary.items} {catSummary.items === 1 ? 'item' : 'itens'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      <NovaCategoriaDialog
        open={showNewCategory}
        onClose={() => setShowNewCategory(false)}
      />
    </div>
  )
}
