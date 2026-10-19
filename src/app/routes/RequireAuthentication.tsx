import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../modules/authentication/state/useAuthStore'

export function RequireAuthentication() {
  const session = useAuthStore((state) => state.session)
  return session ? <Outlet /> : <Navigate to="/login" replace />
}
