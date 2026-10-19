import { useMemo } from 'react'
import { localDatabase } from '../../../data/localDatabase'
import { mergeEntrepreneurships } from '../application/mergeEntrepreneurships'
import type { Entrepreneurship } from '../domain/Entrepreneurship'
import { useEntrepreneurshipStore } from './useEntrepreneurshipStore'

/** Catálogo completo (base + lo creado o editado en localStorage), reactivo a los cambios del store. */
export function useEntrepreneurships(): Entrepreneurship[] {
  const stored = useEntrepreneurshipStore((state) => state.entrepreneurships)
  return useMemo(() => mergeEntrepreneurships(localDatabase.entrepreneurships, stored), [stored])
}
