import {
  Utensils,
  Fuel,
  ShoppingCart,
  PiggyBank,
  Wallet,
  Ticket,
  Home,
  HeartPulse,
  Briefcase,
  CarFront,
  Dumbbell,
  BookOpen,
  BaggageClaim,
  Mailbox,
  ReceiptText,
  PawPrint,
  Gift,
  ToolCase,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type CategoryStyle = {
  badge: string
  iconBg: string
  iconColor: string
}

export type CategoryData = {
  name: string
  description: string
  icon: LucideIcon
  style: CategoryStyle
}

export const categories: CategoryData[] = [
  {
    name: 'Alimentação',
    description: 'Restaurantes, delivery e refeições',
    icon: Utensils,
    style: {
      badge: 'bg-yellow-100 text-yellow-700',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-700',
    },
  },
  {
    name: 'Entretenimento',
    description: 'Cinema, jogos e lazer',
    icon: Ticket,
    style: {
      badge: 'bg-red-100 text-red-700',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-700',
    },
  },
  {
    name: 'Investimento',
    description: 'Aplicações e retornos financeiros',
    icon: PiggyBank,
    style: {
      badge: 'bg-green-100 text-green-700',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-700',
    },
  },
  {
    name: 'Mercado',
    description: 'Compras de supermercado e mantimentos',
    icon: ShoppingCart,
    style: {
      badge: 'bg-purple-100 text-purple-700',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-700',
    },
  },
  {
    name: 'Salário',
    description: 'Renda mensal e bonificações',
    icon: Briefcase,
    style: {
      badge: 'bg-green-100 text-green-700',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-700',
    },
  },
  {
    name: 'Saúde',
    description: 'Medicamentos, consultas e exames',
    icon: HeartPulse,
    style: {
      badge: 'bg-pink-100 text-pink-700',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-700',
    },
  },
  {
    name: 'Transporte',
    description: 'Gasolina, transporte público e viagens',
    icon: Fuel,
    style: {
      badge: 'bg-red-100 text-red-700',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-700',
    },
  },
  {
    name: 'Utilidades',
    description: 'Energia, água, internet e telefone',
    icon: Home,
    style: {
      badge: 'bg-yellow-100 text-yellow-700',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-700',
    },
  },
]

export const colorStyleMap: Record<string, CategoryStyle> = {
  green: { badge: 'bg-green-100 text-green-700', iconBg: 'bg-green-100', iconColor: 'text-green-700' },
  blue: { badge: 'bg-blue-100 text-blue-700', iconBg: 'bg-blue-100', iconColor: 'text-blue-700' },
  purple: { badge: 'bg-purple-100 text-purple-700', iconBg: 'bg-purple-100', iconColor: 'text-purple-700' },
  pink: { badge: 'bg-pink-100 text-pink-700', iconBg: 'bg-pink-100', iconColor: 'text-pink-700' },
  red: { badge: 'bg-red-100 text-red-700', iconBg: 'bg-red-100', iconColor: 'text-red-700' },
  orange: { badge: 'bg-orange-100 text-orange-700', iconBg: 'bg-orange-100', iconColor: 'text-orange-700' },
  yellow: { badge: 'bg-yellow-100 text-yellow-700', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-700' },
}

export const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  CarFront,
  HeartPulse,
  PiggyBank,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
  PawPrint,
  Home,
  Gift,
  Dumbbell,
  BookOpen,
  BaggageClaim,
  Mailbox,
  ReceiptText,
}

export const categoryStyles: Record<string, CategoryStyle> = {
  Receita: {
    badge: 'bg-green-100 text-green-700',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-700',
  },
  ...Object.fromEntries(
    categories.map(cat => [cat.name, cat.style]),
  ),
}

export const categoryIcons: Record<string, LucideIcon> = {
  Receita: Wallet,
  ...Object.fromEntries(
    categories.map(cat => [cat.name, cat.icon]),
  ),
}

export const defaultCategoryStyle: CategoryStyle = {
  badge: 'bg-gray-100 text-gray-600',
  iconBg: 'bg-gray-100',
  iconColor: 'text-gray-600',
}

export function getCategoryStyle(category: string, color?: string | null): CategoryStyle {
  if (color && colorStyleMap[color]) return colorStyleMap[color]
  return categoryStyles[category] ?? defaultCategoryStyle
}

export function getCategoryIcon(category: string, icon?: string | null): LucideIcon {
  if (icon && iconMap[icon]) return iconMap[icon]
  return categoryIcons[category] ?? Wallet
}
