import type { Entrepreneurship } from '../domain/Entrepreneurship'
import type { EntrepreneurshipRepository } from '../domain/EntrepreneurshipRepository'

export class GetAllEntrepreneurships {
  private readonly repository: EntrepreneurshipRepository

  constructor(repository: EntrepreneurshipRepository) {
    this.repository = repository
  }

  execute(): Entrepreneurship[] {
    return this.repository.findAll()
  }
}
