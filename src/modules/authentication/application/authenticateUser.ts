import { z } from 'zod'
import type { User } from '../../users/domain/User'
import type { UserRepository } from '../../users/domain/UserRepository'

export const LoginCredentialsSchema = z.object({
  email: z.string().trim().min(1, 'Ingresa tu correo electrónico.').email('Ingresa un correo electrónico válido.'),
  password: z.string().min(1, 'Ingresa tu contraseña.'),
})

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>
export type LoginFieldErrors = Partial<Record<keyof LoginCredentials, string>>

export type AuthenticationResult =
  | { kind: 'success'; user: User }
  | { kind: 'validation-error'; fieldErrors: LoginFieldErrors }
  | { kind: 'invalid-credentials' }

export class AuthenticateUser {
  private readonly userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  execute(input: LoginCredentials): AuthenticationResult {
    const parsedCredentials = LoginCredentialsSchema.safeParse(input)

    if (!parsedCredentials.success) {
      const fieldErrors: LoginFieldErrors = {}
      for (const issue of parsedCredentials.error.issues) {
        const field = issue.path[0]
        if ((field === 'email' || field === 'password') && !fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      return { kind: 'validation-error', fieldErrors }
    }

    const user = this.userRepository.findByCredentials(
      parsedCredentials.data.email,
      parsedCredentials.data.password,
    )
    return user ? { kind: 'success', user } : { kind: 'invalid-credentials' }
  }
}
