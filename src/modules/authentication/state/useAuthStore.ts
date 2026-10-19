import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../../users/domain/User'
import { AuthSessionSchema, createMockSession, type AuthSession } from '../domain/AuthSession'

export const AUTH_STORAGE_KEY = 'chambea-pe-auth-session'

interface AuthStore {
  session: AuthSession | null
  startSession: (user: User) => void
  logout: () => void
}

type PersistedAuth = Pick<AuthStore, 'session'>

function clearPersistedSession() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}

export const createAuthStore = () =>
  create<AuthStore>()(
    persist(
      (set) => ({
        session: null,
        startSession: (user) => set({ session: createMockSession(user) }),
        logout: () => {
          set({ session: null })
          clearPersistedSession()
        },
      }),
      {
        name: AUTH_STORAGE_KEY,
        partialize: (state): PersistedAuth => ({ session: state.session }),
        // Valida lo guardado en localStorage: una sesión corrupta, manipulada o con
        // datos sensibles heredados (ej. password) se limpia o se descarta.
        merge: (persisted, current) => {
          const parsed = AuthSessionSchema.safeParse((persisted as Partial<PersistedAuth> | undefined)?.session)
          return { ...current, session: parsed.success ? parsed.data : null }
        },
      },
    ),
  )

export const useAuthStore = createAuthStore()
