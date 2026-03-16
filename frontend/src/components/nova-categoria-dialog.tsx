import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
import {
  Briefcase,
  HeartPulse,
  PiggyBank,
  ShoppingCart,
  Ticket,
  Gift,
  Utensils,
  PawPrint,
  Home,
  Dumbbell,
  BookOpen,
  CarFront,
  BaggageClaim,
  Mailbox,
  ReceiptText,
  ToolCase,
  Loader2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Dialog } from './dialog'
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '../lib/graphql/mutations/category.mutations'
import { LIST_CATEGORIES } from '../lib/graphql/queries/category.queries'

type CategoryToEdit = {
  id: string
  name: string
  color?: string | null
  icon?: string | null
  description?: string | null
}

type Props = {
  open: boolean
  onClose: () => void
  category?: CategoryToEdit | null
}

type IconOption = {
  name: string
  icon: LucideIcon
}

const iconOptions: IconOption[] = [
  { name: 'Briefcase', icon: Briefcase },
  { name: 'CarFront', icon: CarFront },
  { name: 'HeartPulse', icon: HeartPulse },
  { name: 'PiggyBank', icon: PiggyBank },
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'Ticket', icon: Ticket },
  { name: 'ToolCase', icon: ToolCase },
  { name: 'Utensils', icon: Utensils },
  { name: 'PawPrint', icon: PawPrint },
  { name: 'Home', icon: Home },
  { name: 'Gift', icon: Gift },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'BaggageClaim', icon: BaggageClaim },
  { name: 'Mailbox', icon: Mailbox },
  { name: 'ReceiptText', icon: ReceiptText },
]

const colorOptions = [
  { name: 'green', bg: 'bg-green-600' },
  { name: 'blue', bg: 'bg-blue-600' },
  { name: 'purple', bg: 'bg-purple-600' },
  { name: 'pink', bg: 'bg-pink-500' },
  { name: 'red', bg: 'bg-red-500' },
  { name: 'orange', bg: 'bg-orange-500' },
  { name: 'yellow', bg: 'bg-yellow-500' },
]

export function NovaCategoriaDialog({ open, onClose, category }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const isEditing = !!category

  useEffect(() => {
    if (category) {
      setTitle(category.name)
      setSelectedColor(category.color ?? '')
      setSelectedIcon(category.icon ?? '')
      setDescription(category.description ?? '')
    }
  }, [category])

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [{ query: LIST_CATEGORIES }],
    onCompleted: () => {
      toast.success('Categoria criada')
      handleClose()
    },
    onError: (error) => toast.error(error.message),
  })

  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [{ query: LIST_CATEGORIES }],
    onCompleted: () => {
      toast.success('Categoria atualizada')
      handleClose()
    },
    onError: (error) => toast.error(error.message),
  })

  const loading = creating || updating

  function handleClose() {
    setTitle('')
    setDescription('')
    setSelectedIcon('')
    setSelectedColor('')
    onClose()
  }

  function handleSave() {
    if (!title.trim()) return

    const data = {
      name: title,
      color: selectedColor || undefined,
      icon: selectedIcon || undefined,
      description: description || undefined,
    }

    if (isEditing) {
      updateCategory({ variables: { id: category!.id, data } })
    } else {
      createCategory({ variables: { data } })
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={isEditing ? 'Editar categoria' : 'Nova categoria'}
      subtitle="Organize suas transações com categorias"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Título
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Ex. Alimentação"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Descrição
        </label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Descrição da categoria"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
        />
      </div>

      <p className="text-xs text-gray-400 mb-3">Opcional</p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ícone
        </label>
        <div className="grid grid-cols-8 gap-2">
          {iconOptions.map(opt => {
            const Icon = opt.icon
            const isSelected = selectedIcon === opt.name
            return (
              <button
                key={opt.name}
                type="button"
                onClick={() => setSelectedIcon(opt.name)}
                className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-colors ${
                  isSelected
                    ? 'border-green-700 bg-green-50 text-gray-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-400'
                }`}
              >
                <Icon size={18} />
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cor
        </label>
        <div className="grid grid-cols-7 gap-2">
          {colorOptions.map(opt => (
            <button
              key={opt.name}
              type="button"
              onClick={() => setSelectedColor(opt.name)}
              className={`p-1.5 rounded-xl border-2 transition-all ${
                selectedColor === opt.name
                  ? 'border-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`h-7 w-full rounded-lg ${opt.bg}`} />
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={loading || !title.trim()}
        className="w-full bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        Salvar
      </button>
    </Dialog>
  )
}
