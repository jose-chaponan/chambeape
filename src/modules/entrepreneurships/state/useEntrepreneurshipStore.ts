import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { EntrepreneurshipSchema, type Entrepreneurship } from '../domain/Entrepreneurship'

export const ENTREPRENEURSHIP_STORAGE_KEY = 'chambea-pe-entrepreneurships'

interface EntrepreneurshipStore {
  /**
   * Emprendimientos creados o editados por los usuarios (clave: id). Un id que también existe en el
   * JSON base lo reemplaza; uno nuevo se suma al catálogo.
   */
  entrepreneurships: Record<string, Entrepreneurship>
  /** Devuelve false si no se pudo guardar (por ejemplo, localStorage lleno por las fotos). */
  save: (entrepreneurship: Entrepreneurship) => boolean
}

type PersistedEntrepreneurships = Pick<EntrepreneurshipStore, 'entrepreneurships'>

export const createEntrepreneurshipStore = () => {
  const useStore = create<EntrepreneurshipStore>()(
    persist(
      (set, get) => ({
        entrepreneurships: {},
        save: (entrepreneurship) => {
          const previous = get().entrepreneurships
          try {
            set({ entrepreneurships: { ...previous, [entrepreneurship.id]: entrepreneurship } })
            return true
          } catch {
            // Escribir en localStorage falló: se deshace el cambio en memoria para no mostrar algo que no se guardó.
            try {
              set({ entrepreneurships: previous })
            } catch {
              // Nada más que hacer: el almacenamiento sigue sin responder.
            }
            return false
          }
        },
      }),
      {
        name: ENTREPRENEURSHIP_STORAGE_KEY,
        partialize: (state): PersistedEntrepreneurships => ({ entrepreneurships: state.entrepreneurships }),
        // Lo guardado puede estar manipulado o corrupto: se conserva solo lo que valida.
        merge: (persisted, current) => {
          const stored = (persisted as Partial<PersistedEntrepreneurships> | undefined)?.entrepreneurships
          const entrepreneurships: Record<string, Entrepreneurship> = {}

          if (stored && typeof stored === 'object') {
            for (const value of Object.values(stored)) {
              const parsed = EntrepreneurshipSchema.safeParse(value)
              if (parsed.success) {
                entrepreneurships[parsed.data.id] = parsed.data
              }
            }
          }
          return { ...current, entrepreneurships }
        },
      },
    ),
  )
  return useStore
}

export const useEntrepreneurshipStore = createEntrepreneurshipStore()
