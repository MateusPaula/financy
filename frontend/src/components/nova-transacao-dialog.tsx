import { useState } from 'react'
import { CircleArrowDown, CircleArrowUp } from 'lucide-react'
import { Dialog } from './dialog'
import { categories } from '../data/categories'

type Props = {
  open: boolean
  onClose: () => void
}

const expenseCategories = categories.map(c => c.name)

export function NovaTransacaoDialog({ open, onClose }: Props) {
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')

  function handleClose() {
    setType('expense')
    setDescription('')
    setDate('')
    setAmount('')
    setCategory('')
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Nova transação"
      subtitle="Registre sua despesa ou receita"
    >
      {/* Type toggle */}
      <div className="grid grid-cols-2 border border-gray-200 rounded-xl p-1 mb-5">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            type === 'expense'
              ? 'border-2 border-red-500 bg-white text-gray-900'
              : 'border-2 border-transparent text-gray-400'
          }`}
        >
          <CircleArrowDown size={16} className={type === 'expense' ? 'text-red-500' : 'text-gray-400'} />
          Despesa
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            type === 'income'
              ? 'border-2 border-green-600 bg-white text-gray-900'
              : 'border-2 border-transparent text-gray-400'
          }`}
        >
          <CircleArrowUp size={16} className={type === 'income' ? 'text-green-600' : 'text-gray-400'} />
          Receita
        </button>
      </div>

      {/* Description */}
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

      {/* Date + Amount */}
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

      {/* Category */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Categoria
        </label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
        >
          <option value="">Selecione</option>
          {expenseCategories.map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Save button */}
      <button
        type="button"
        className="w-full bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
      >
        Salvar
      </button>
    </Dialog>
  )
}
