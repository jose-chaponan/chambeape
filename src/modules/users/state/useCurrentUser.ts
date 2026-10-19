import { useMemo } from 'react'
import { useAuthStore } from '../../authentication/state/useAuthStore'
import { resolveUser, type ResolvedUser } from '../domain/UserProfile'
import { useProfileStore } from './useProfileStore'

/** Usuario en sesión con sus datos editados (localStorage) por encima de los del dominio. */
export function useCurrentUser(): ResolvedUser | null {
  const sessionUser = useAuthStore((state) => state.session?.user)
  const storedProfile = useProfileStore((state) => (sessionUser ? state.profiles[sessionUser.id] : undefined))

  return useMemo(() => (sessionUser ? resolveUser(sessionUser, storedProfile) : null), [sessionUser, storedProfile])
}
