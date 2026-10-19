import type { Entrepreneurship } from '../domain/Entrepreneurship'

/**
 * Catálogo base más lo que los usuarios crearon o editaron: un id guardado reemplaza al del dominio
 * y los ids nuevos se suman al final.
 */
export function mergeEntrepreneurships(
  base: Entrepreneurship[],
  stored: Record<string, Entrepreneurship>,
): Entrepreneurship[] {
  const baseIds = new Set(base.map((entrepreneurship) => entrepreneurship.id))

  return [
    ...base.map((entrepreneurship) => stored[entrepreneurship.id] ?? entrepreneurship),
    ...Object.values(stored).filter((entrepreneurship) => !baseIds.has(entrepreneurship.id)),
  ]
}
