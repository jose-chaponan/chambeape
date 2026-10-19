import { z } from 'zod'
import { EntrepreneurshipSchema } from '../modules/entrepreneurships/domain/Entrepreneurship'
import { EntrepreneurshipCategorySchema } from '../modules/entrepreneurships/domain/EntrepreneurshipCategory'
import { UserSchema } from '../modules/users/domain/User'
import rawDatabase from './mock-database.json'

const LocalDatabaseSchema = z
  .object({
    users: z.array(UserSchema),
    categories: z.array(EntrepreneurshipCategorySchema),
    entrepreneurships: z.array(EntrepreneurshipSchema),
  })
  .superRefine((database, context) => {
    const categoryIds = new Set(database.categories.map((category) => category.id))

    database.entrepreneurships.forEach((entrepreneurship, index) => {
      if (!categoryIds.has(entrepreneurship.categoryId)) {
        context.addIssue({
          code: 'custom',
          message: `Unknown category "${entrepreneurship.categoryId}"`,
          path: ['entrepreneurships', index, 'categoryId'],
        })
      }
    })
  })

export const localDatabase = LocalDatabaseSchema.parse(rawDatabase)
