import type { Entrepreneurship } from '../domain/Entrepreneurship'
import type { EntrepreneurshipRepository } from '../domain/EntrepreneurshipRepository'

export class GetEntrepreneurshipsForUser {
  private readonly repository: EntrepreneurshipRepository

  constructor(repository: EntrepreneurshipRepository) {
    this.repository = repository
  }

  execute(ownerUserId: string): Entrepreneurship[] {
    return this.repository.findByOwnerId(ownerUserId)
  }
}
