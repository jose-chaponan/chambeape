import type { Entrepreneurship } from '../domain/Entrepreneurship'
import type { EntrepreneurshipRepository } from '../domain/EntrepreneurshipRepository'

export class GetEntrepreneurshipById {
  private readonly repository: EntrepreneurshipRepository

  constructor(repository: EntrepreneurshipRepository) {
    this.repository = repository
  }

  execute(id: string): Entrepreneurship | undefined {
    return this.repository.findById(id)
  }
}
