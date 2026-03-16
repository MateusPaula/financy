import { Link, useLocation } from 'react-router-dom'
import LogoSvg from '../assets/logo.svg'
import { useAuthStore } from '../stores/auth'

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Transações', path: '/transacoes' },
  { label: 'Categorias', path: '/categorias' },
]

export function DashboardHeader() {
  const location = useLocation()
  const user = useAuthStore(s => s.user)

  const initials = user
    ? user.name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <img src={LogoSvg} alt="Financy Logo" className="h-8 w-auto" />

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={
                  location.pathname === item.path
                    ? 'text-green-700 font-semibold text-sm'
                    : 'text-gray-600 hover:text-gray-900 text-sm transition-colors'
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/perfil"
            className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold"
          >
            {initials}
          </Link>
        </div>

        <nav className="flex md:hidden items-center gap-6 pb-3 -mt-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={
                location.pathname === item.path
                  ? 'text-green-700 font-semibold text-sm'
                  : 'text-gray-600 hover:text-gray-900 text-sm transition-colors'
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
