import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../modules/authentication/state/useAuthStore'

export function RedirectAuthenticated() {
  const session = useAuthStore((state) => state.session)
  return session ? <Navigate to="/home" replace /> : <Outlet />
}
