import type { Entrepreneurship } from './Entrepreneurship'

export interface EntrepreneurshipRepository {
  findAll(): Entrepreneurship[]
  findByOwnerId(ownerUserId: string): Entrepreneurship[]
}
