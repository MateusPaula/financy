import { useState } from 'react'
import { User, Mail, LogOut } from 'lucide-react'
import { DashboardHeader } from './dashboard-header'

export function Perfil() {
  const [nome, setNome] = useState('Conta teste')
  const email = 'conta@teste.com'

  const initials = nome
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="min-h-dvh bg-gray-100">
      <DashboardHeader />

      <main className="max-w-lg mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="bg-white border border-gray-300 rounded-xl p-6 md:p-8">
          {/* Avatar + info */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xl font-semibold mb-3">
              {initials}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{nome}</h2>
            <p className="text-sm text-gray-500">{email}</p>
          </div>

          <hr className="border-gray-200 mb-6" />

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nome completo
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-500 bg-gray-50 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                O e-mail não pode ser alterado
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <button
              type="button"
              className="w-full bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
            >
              Salvar alterações
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 text-sm font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <LogOut size={16} className="text-red-500" />
              Sair da conta
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
