import { describe, expect, it } from 'vitest'
import { JsonUserRepository } from '../../users/infrastructure/JsonUserRepository'
import { AuthenticateUser } from './authenticateUser'

describe('AuthenticateUser', () => {
  const authenticateUser = new AuthenticateUser(new JsonUserRepository())

  it('reports Zod validation errors before reading the repository', () => {
    const result = authenticateUser.execute({ email: 'not-an-email', password: '' })

    expect(result).toEqual({
      kind: 'validation-error',
      fieldErrors: {
        email: 'Ingresa un correo electrónico válido.',
        password: 'Ingresa tu contraseña.',
      },
    })
  })

  it('authenticates a seed user', () => {
    const result = authenticateUser.execute({ email: 'admin@gmail.com', password: '1234567890' })

    expect(result).toMatchObject({
      kind: 'success',
      user: { firstNames: 'Administrador' },
    })
  })
})
