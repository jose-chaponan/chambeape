import type { SessionUser } from '../domain/User'

export function getUserDisplayName(user: SessionUser): string {
  return `${user.firstNames} ${user.lastNames}`
}
