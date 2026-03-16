import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'

export function PublicRoute() {
  const token = useAuthStore(s => s.token)

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
