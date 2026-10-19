import { beforeEach, describe, expect, it } from 'vitest'
import { resolveUser, type UserProfile } from '../domain/UserProfile'
import { createProfileStore, PROFILE_STORAGE_KEY } from './useProfileStore'

const profile: UserProfile = {
  firstNames: 'Yuli',
  lastNames: 'Ríos',
  phone: '987654321',
  gender: 'female',
  birthDate: '1995-04-10',
  avatarUrl: '',
}

const baseUser = { id: 'usr-1', email: 'a@b.com', firstNames: 'Yuliana', lastNames: 'Ríos del Aguila' }

describe('useProfileStore', () => {
  beforeEach(() => window.localStorage.clear())

  it('persists saved profiles in localStorage per user', () => {
    const store = createProfileStore()
    store.getState().saveProfile('usr-1', profile)

    const raw = JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY) ?? '{}')
    expect(raw.state.profiles['usr-1']).toEqual(profile)
  })

  it('restores saved profiles on a fresh store', () => {
    createProfileStore().getState().saveProfile('usr-1', profile)

    expect(createProfileStore().getState().profiles['usr-1']).toEqual(profile)
  })

  it('discards corrupt or tampered entries when rehydrating', () => {
    window.localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify({
        state: { profiles: { good: profile, bad: { ...profile, phone: 'abc' }, worse: 'x' } },
        version: 0,
      }),
    )

    expect(Object.keys(createProfileStore().getState().profiles)).toEqual(['good'])
  })
})

describe('resolveUser', () => {
  it('uses the domain data when nothing was edited', () => {
    expect(resolveUser(baseUser)).toMatchObject({ firstNames: 'Yuliana', phone: '', avatarUrl: '' })
  })

  it('prefers the stored profile but never changes the email', () => {
    const resolved = resolveUser(baseUser, profile)

    expect(resolved.firstNames).toBe('Yuli')
    expect(resolved.phone).toBe('987654321')
    expect(resolved.email).toBe('a@b.com')
  })
})
