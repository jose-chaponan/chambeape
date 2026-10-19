import { localDatabase } from '../../../data/localDatabase'
import type { EntrepreneurshipCategory } from '../domain/EntrepreneurshipCategory'
import type { EntrepreneurshipCategoryRepository } from '../domain/EntrepreneurshipCategoryRepository'

export class JsonEntrepreneurshipCategoryRepository implements EntrepreneurshipCategoryRepository {
  findAll(): EntrepreneurshipCategory[] {
    return localDatabase.categories
  }
}
