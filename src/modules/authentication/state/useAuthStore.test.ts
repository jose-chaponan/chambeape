import { beforeEach, describe, expect, it } from 'vitest'
import type { User } from '../../users/domain/User'
import { AUTH_STORAGE_KEY, createAuthStore, useAuthStore } from './useAuthStore'

const user: User = {
  id: 'test-user',
  email: 'test@example.com',
  password: '1234567890',
  firstNames: 'Persona',
  lastNames: 'De prueba',
}

describe('useAuthStore', () => {
  beforeEach(() => {
    window.localStorage.clear()
    useAuthStore.setState({ session: null })
  })

  it('persists a mock token and restores the session in a new store instance', () => {
    const firstStore = createAuthStore()
    firstStore.getState().startSession(user)

    expect(firstStore.getState().session?.token).toContain('mock-token.test-user.')

    const restoredStore = createAuthStore()
    expect(restoredStore.getState().session?.user.email).toBe('test@example.com')
  })

  it('clears the persisted session when logging out', () => {
    useAuthStore.getState().startSession(user)
    useAuthStore.getState().logout()

    expect(useAuthStore.getState().session).toBeNull()
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })

  it('never persists the user password', () => {
    useAuthStore.getState().startSession(user)

    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).not.toContain('1234567890')
  })

  it('discards a corrupted persisted session', () => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ state: { session: { token: '' } }, version: 0 }))

    expect(createAuthStore().getState().session).toBeNull()
  })
})
