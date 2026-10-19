import { z } from 'zod'

export const EntrepreneurshipCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  icon: z.enum(['food', 'crafts', 'fashion', 'beauty', 'home', 'construction']),
})

export type EntrepreneurshipCategory = z.infer<typeof EntrepreneurshipCategorySchema>
