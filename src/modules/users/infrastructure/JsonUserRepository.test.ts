import { describe, expect, it } from 'vitest'
import { JsonUserRepository } from './JsonUserRepository'

describe('JsonUserRepository', () => {
  const repository = new JsonUserRepository()

  it('finds the Yuliana seed user with a case-insensitive email', () => {
    const user = repository.findByCredentials('YULIANARIOSDELAGUILA@GMAIL.COM', '1234567890')

    expect(user).toMatchObject({
      email: 'yulianariosdelaguila@gmail.com',
      firstNames: 'Yuliana Kelly',
      lastNames: 'Ríos del Aguila',
    })
  })

  it('returns null when local credentials do not match', () => {
    expect(repository.findByCredentials('admin@gmail.com', 'incorrecta')).toBeNull()
  })
})
