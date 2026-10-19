import { localDatabase } from '../../../data/localDatabase'
import type { User } from '../domain/User'
import type { UserRepository } from '../domain/UserRepository'

export class JsonUserRepository implements UserRepository {
  findByCredentials(email: string, password: string): User | null {
    const normalizedEmail = email.trim().toLocaleLowerCase()
    return localDatabase.users.find(
      (user) => user.email.toLocaleLowerCase() === normalizedEmail && user.password === password,
    ) ?? null
  }
}
