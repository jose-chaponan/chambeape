import type { User } from './User'

export interface UserRepository {
  findByCredentials(email: string, password: string): User | null
}
