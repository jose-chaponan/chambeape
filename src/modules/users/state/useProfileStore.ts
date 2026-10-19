import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfileSchema, type UserProfile } from '../domain/UserProfile'

export const PROFILE_STORAGE_KEY = 'chambea-pe-user-profiles'

interface ProfileStore {
  /** Datos editados por cada usuario (clave: id de usuario). Si existe, reemplaza a los del dominio. */
  profiles: Record<string, UserProfile>
  saveProfile: (userId: string, profile: UserProfile) => void
}

type PersistedProfiles = Pick<ProfileStore, 'profiles'>

export const createProfileStore = () =>
  create<ProfileStore>()(
    persist(
      (set) => ({
        profiles: {},
        saveProfile: (userId, profile) =>
          set((state) => ({ profiles: { ...state.profiles, [userId]: profile } })),
      }),
      {
        name: PROFILE_STORAGE_KEY,
        partialize: (state): PersistedProfiles => ({ profiles: state.profiles }),
        // Lo guardado puede estar manipulado o corrupto: se conserva solo lo que valida.
        merge: (persisted, current) => {
          const stored = (persisted as Partial<PersistedProfiles> | undefined)?.profiles
          const profiles: Record<string, UserProfile> = {}

          if (stored && typeof stored === 'object') {
            for (const [userId, value] of Object.entries(stored)) {
              const parsed = UserProfileSchema.safeParse(value)
              if (parsed.success) {
                profiles[userId] = parsed.data
              }
            }
          }
          return { ...current, profiles }
        },
      },
    ),
  )

export const useProfileStore = createProfileStore()
