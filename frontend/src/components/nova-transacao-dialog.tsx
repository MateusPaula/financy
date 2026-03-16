import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { toast } from 'sonner'
import { CircleArrowDown, CircleArrowUp, Loader2 } from 'lucide-react'
import { Dialog } from './dialog'
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from '../lib/graphql/mutations/transaction.mutations'
import { LIST_TRANSACTIONS, TOTAL_BALANCE, MONTHLY_INCOME, MONTHLY_EXPENSES } from '../lib/graphql/queries/transaction.queries'
import { LIST_CATEGORIES } from '../lib/graphql/queries/category.queries'
import type { Category, Transaction } from '../types'

type Props = {
  open: boolean
  onClose: () => void
  transaction?: Transaction | null
}

const refetchAfterMutation = [
  { query: LIST_TRANSACTIONS },
  { query: TOTAL_BALANCE },
  { query: MONTHLY_INCOME },
  { query: MONTHLY_EXPENSES },
  { query: LIST_CATEGORIES },
]

export function NovaTransacaoDialog({ open, onClose, transaction }: Props) {
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const isEditing = !!transaction

  const { data: categoriesData } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES)
  const categoryList = categoriesData?.listCategories ?? []

  useEffect(() => {
    if (transaction) {
      setType(transaction.type as 'EXPENSE' | 'INCOME')
      setDescription(transaction.name)
      setDate(transaction.date.split('T')[0])
      setAmount(String(transaction.amount))
      setCategoryId(transaction.categoryId)
    }
  }, [transaction])

  const [createTransaction, { loading: creating }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: refetchAfterMutation,
    onCompleted: () => {
      toast.success('Transação criada')
      handleClose()
    },
    onError: (error) => toast.error(error.message),
  })

  const [updateTransaction, { loading: updating }] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries: refetchAfterMutation,
    onCompleted: () => {
      toast.success('Transação atualizada')
      handleClose()
    },
    onError: (error) => toast.error(error.message),
  })

  const loading = creating || updating

  function handleClose() {
    setType('EXPENSE')
    setDescription('')
    setDate('')
    setAmount('')
    setCategoryId('')
    onClose()
  }

  function handleSave() {
    if (!description.trim() || !date || !amount || !categoryId) return

    const parsedAmount = Number(amount.replace(',', '.'))
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Valor inválido')
      return
    }

    if (isEditing) {
      updateTransaction({
        variables: {
          id: transaction!.id,
          data: {
            name: description,
            amount: parsedAmount,
            date,
            type,
            categoryId,
          },
        },
      })
    } else {
      createTransaction({
        variables: {
          data: {
            name: description,
            amount: parsedAmount,
            date,
            type,
            categoryId,
          },
        },
      })
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={isEditing ? 'Editar transação' : 'Nova transação'}
      subtitle="Registre sua despesa ou receita"
    >
      <div className="grid grid-cols-2 border border-gray-200 rounded-xl p-1 mb-5">
        <button
          type="button"
          onClick={() => setType('EXPENSE')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            type === 'EXPENSE'
              ? 'border-2 border-red-500 bg-white text-gray-900'
              : 'border-2 border-transparent text-gray-400'
          }`}
        >
          <CircleArrowDown size={16} className={type === 'EXPENSE' ? 'text-red-500' : 'text-gray-400'} />
          Despesa
        </button>
        <button
          type="button"
          onClick={() => setType('INCOME')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            type === 'INCOME'
              ? 'border-2 border-green-600 bg-white text-gray-900'
              : 'border-2 border-transparent text-gray-400'
          }`}
        >
          <CircleArrowUp size={16} className={type === 'INCOME' ? 'text-green-600' : 'text-gray-400'} />
          Receita
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Descrição
        </label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Ex. Almoço no restaurante"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Data
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Valor
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              R$
            </span>
            <input
              type="text"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Categoria
        </label>
        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
        >
          <option value="">Selecione</option>
          {categoryList.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        Salvar
      </button>
    </Dialog>
  )
}
