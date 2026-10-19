import type { EntrepreneurshipCategory } from '../domain/EntrepreneurshipCategory'
import type { EntrepreneurshipCategoryRepository } from '../domain/EntrepreneurshipCategoryRepository'

export class GetEntrepreneurshipCategories {
  private readonly repository: EntrepreneurshipCategoryRepository

  constructor(repository: EntrepreneurshipCategoryRepository) {
    this.repository = repository
  }

  execute(): EntrepreneurshipCategory[] {
    return this.repository.findAll()
  }
}
