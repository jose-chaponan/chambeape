import type { Entrepreneurship } from './Entrepreneurship'

export interface EntrepreneurshipRepository {
  findAll(): Entrepreneurship[]
  findById(id: string): Entrepreneurship | undefined
  findByOwnerId(ownerUserId: string): Entrepreneurship[]
}
