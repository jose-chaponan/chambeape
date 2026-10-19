import type { EntrepreneurshipCategory } from './EntrepreneurshipCategory'

export interface EntrepreneurshipCategoryRepository {
  findAll(): EntrepreneurshipCategory[]
}
