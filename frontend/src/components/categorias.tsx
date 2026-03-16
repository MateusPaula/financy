import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import {
  Plus,
  Tag,
  ArrowUpDown,
  Trash2,
  Pencil,
} from 'lucide-react'
import { DashboardHeader } from './dashboard-header'
import { getCategoryStyle, getCategoryIcon } from '../data/categories'
import { NovaCategoriaDialog } from './nova-categoria-dialog'
import { LIST_CATEGORIES } from '../lib/graphql/queries/category.queries'
import { DELETE_CATEGORY } from '../lib/graphql/mutations/category.mutations'
import type { Category } from '../types'

export function Categorias() {
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const { data, loading: queryLoading } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES)
  const categoryList = data?.listCategories ?? []

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [{ query: LIST_CATEGORIES }],
    onCompleted: () => toast.success('Categoria excluída'),
    onError: (error) => toast.error(error.message),
  })

  const totalTransactions = categoryList.reduce((sum, c) => sum + c.transactionCount, 0)
  const mostUsed = categoryList.length > 0
    ? categoryList.reduce((max, c) => c.transactionCount > max.transactionCount ? c : max, categoryList[0])
    : null

  const MostUsedIcon = mostUsed ? getCategoryIcon(mostUsed.name, mostUsed.icon) : Tag
  const mostUsedStyle = mostUsed ? getCategoryStyle(mostUsed.name, mostUsed.color) : { iconColor: 'text-gray-500' }

  function handleDelete(id: string) {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      deleteCategory({ variables: { id } })
    }
  }

  function handleEdit(cat: Category) {
    setEditingCategory(cat)
  }

  return (
    <div className="min-h-dvh bg-gray-100">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="bg-white border border-gray-300 rounded-xl p-5 md:p-6">
            <div className="flex items-center gap-3">
              <Tag size={24} className="text-gray-500 shrink-0" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{categoryList.length}</p>
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
                <p className="text-2xl font-bold text-gray-900">{mostUsed?.name ?? '-'}</p>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Categoria mais utilizada
                </span>
              </div>
            </div>
          </div>
        </div>

        {queryLoading ? (
          <p className="text-gray-500 text-center py-12">Carregando...</p>
        ) : categoryList.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Nenhuma categoria criada ainda</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categoryList.map(cat => {
              const Icon = getCategoryIcon(cat.name, cat.icon)
              const colors = getCategoryStyle(cat.name, cat.color)

              return (
                <div
                  key={cat.id}
                  className="bg-white border border-gray-300 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colors.iconBg}`}
                    >
                      <Icon size={20} className={colors.iconColor} />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 text-red-500 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(cat)}
                        className="p-1.5 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900">{cat.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 mb-4">
                    {cat.description || `${cat.transactionCount} ${cat.transactionCount === 1 ? 'transação' : 'transações'}`}
                  </p>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${colors.badge}`}
                    >
                      {cat.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {cat.transactionCount} {cat.transactionCount === 1 ? 'item' : 'itens'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <NovaCategoriaDialog
        open={showNewCategory || !!editingCategory}
        onClose={() => {
          setShowNewCategory(false)
          setEditingCategory(null)
        }}
        category={editingCategory}
      />
    </div>
  )
}
