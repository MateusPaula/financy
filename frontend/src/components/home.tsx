import { useState } from 'react'
import { Header } from "./header"
import * as Form from '@radix-ui/react-form'
import { Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Home() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="min-h-dvh bg-gray-100 flex flex-col p-4 md:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <Header/>
        </div>
      </div>

      <div className="bg-white flex flex-col items-center border border-gray-300 rounded-xl max-w-2xl mx-auto w-full">
        <div className="flex flex-col items-center w-full px-6 md:px-12 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Fazer login</h1>
          <p className="text-gray-600 mb-8">Entre na sua conta para continuar</p>

          <Form.Root className="w-full max-w-md">
            <Form.Field name="email" className="mb-6">
              <Form.Label className="block text-gray-700 font-medium mb-2">
                E-mail
              </Form.Label>

              <div className="relative">
                <Mail size={24} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                <Form.Control asChild>
                  <input
                    type="email"
                    className="w-full pl-14 pr-4 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                    placeholder="mail@exemplo.com"
                    required
                  />
                </Form.Control>
              </div>
            </Form.Field>

            <Form.Field name="password" className="mb-4">
              <Form.Label className="block text-gray-700 font-medium mb-2">
                Senha
              </Form.Label>

              <div className="relative">
                <Lock size={24} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                <Form.Control asChild>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-14 pr-14 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                    placeholder="Digite sua senha"
                    required
                  />
                </Form.Control>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 opacity-40 hover:opacity-60 transition-opacity"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </Form.Field>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-600 cursor-pointer"
                />
                <span className="text-gray-700 text-sm md:text-base">Lembrar-me</span>
              </label>

              <a
                href="#"
                className="text-green-700 hover:text-green-800 text-sm md:text-base font-medium transition-colors"
              >
                Recuperar senha
              </a>
            </div>

            <Form.Submit asChild>
              <button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3.5 rounded-xl transition-colors mb-8"
              >
                Entrar
              </button>
            </Form.Submit>
          </Form.Root>

          <div className="flex items-center gap-4 w-full max-w-md mb-8">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <p className="text-gray-600">Ainda não tem uma conta?</p>
              <Link to='/cadastrar-conta'
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-xl border border-gray-300 transition-colors"
              >
                <UserPlus size={20} />
                Criar conta
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
