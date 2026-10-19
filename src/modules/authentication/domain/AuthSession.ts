import { z } from 'zod'
import { SessionUserSchema, toSessionUser, type User } from '../../users/domain/User'

export const AuthSessionSchema = z.object({
  token: z.string().min(1),
  user: SessionUserSchema,
  authenticatedAt: z.iso.datetime(),
})

export type AuthSession = z.infer<typeof AuthSessionSchema>

function createNonce(): string {
  return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)
}

export function createMockSession(user: User): AuthSession {
  return {
    token: `mock-token.${user.id}.${createNonce()}`,
    user: toSessionUser(user),
    authenticatedAt: new Date().toISOString(),
  }
}
