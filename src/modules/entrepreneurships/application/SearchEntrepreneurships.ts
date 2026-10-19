import type { Entrepreneurship } from '../domain/Entrepreneurship'

export interface EntrepreneurshipSearchCriteria {
  /** Texto libre: se compara con los productos y el nombre del emprendimiento. */
  query?: string
  district?: string
  categoryIds?: string[]
}

// Ignora mayúsculas y tildes para que "pachamanca" encuentre "Pachamanca" y "breña" a "Breña".
export function normalizeSearchText(text: string): string {
  return text
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .trim()
}

export function getEntrepreneurshipDistricts(entrepreneurships: Entrepreneurship[]): string[] {
  return [...new Set(entrepreneurships.map((entrepreneurship) => entrepreneurship.location.district))].sort(
    (a, b) => a.localeCompare(b, 'es'),
  )
}

export function searchEntrepreneurships(
  entrepreneurships: Entrepreneurship[],
  { query = '', district = '', categoryIds = [] }: EntrepreneurshipSearchCriteria,
): Entrepreneurship[] {
  const terms = normalizeSearchText(query).split(/\s+/).filter(Boolean)

  return entrepreneurships.filter((entrepreneurship) => {
    if (categoryIds.length > 0 && !categoryIds.includes(entrepreneurship.categoryId)) return false
    if (district && entrepreneurship.location.district !== district) return false

    const searchable = normalizeSearchText([entrepreneurship.businessName, ...entrepreneurship.products].join(' '))
    return terms.every((term) => searchable.includes(term))
  })
}

/** Otros emprendimientos de la misma categoría; los del mismo distrito y mejor calificados primero. */
export function getRelatedEntrepreneurships(
  entrepreneurships: Entrepreneurship[],
  current: Entrepreneurship,
  limit = 4,
): Entrepreneurship[] {
  const sameDistrict = (other: Entrepreneurship) => (other.location.district === current.location.district ? 1 : 0)

  return entrepreneurships
    .filter((other) => other.id !== current.id && other.categoryId === current.categoryId)
    .sort((a, b) => sameDistrict(b) - sameDistrict(a) || b.rating - a.rating)
    .slice(0, limit)
}
