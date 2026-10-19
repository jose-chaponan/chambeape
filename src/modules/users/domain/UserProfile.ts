import { z } from 'zod'
import type { SessionUser } from './User'

export const GENDER_OPTIONS = [
  { value: 'female', label: 'Femenino' },
  { value: 'male', label: 'Masculino' },
  { value: 'unspecified', label: 'Prefiero no decirlo' },
] as const

const GENDER_VALUES = ['', ...GENDER_OPTIONS.map((option) => option.value)] as [string, ...string[]]

// Foto de perfil guardada como data URL (ya reducida) porque todo vive en localStorage.
export const MAX_AVATAR_DATA_URL_LENGTH = 200_000

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

// Los campos opcionales se guardan como cadena vacía para que el formulario sea siempre controlado.
export const UserProfileSchema = z.object({
  firstNames: z.string().trim().min(1, 'Ingresa tus nombres.').max(60, 'Usa máximo 60 caracteres.'),
  lastNames: z.string().trim().min(1, 'Ingresa tus apellidos.').max(60, 'Usa máximo 60 caracteres.'),
  phone: z
    .string()
    .trim()
    .regex(/^(9\d{8})?$/, 'Ingresa un celular peruano de 9 dígitos que empiece con 9.'),
  gender: z.enum(GENDER_VALUES, 'Selecciona una opción válida.'),
  birthDate: z
    .string()
    .regex(/^(\d{4}-\d{2}-\d{2})?$/, 'Ingresa una fecha válida.')
    .refine((value) => value === '' || (value >= '1900-01-01' && value <= todayIso()), 'Ingresa una fecha válida.'),
  avatarUrl: z
    .string()
    .max(MAX_AVATAR_DATA_URL_LENGTH)
    .refine((value) => value === '' || /^data:image\/(jpeg|png|webp);base64,/.test(value)),
})

export type UserProfile = z.infer<typeof UserProfileSchema>
export type UserProfileErrors = Partial<Record<keyof UserProfile, string>>

/** Usuario ya resuelto: lo guardado en localStorage manda sobre los datos base del dominio. */
export type ResolvedUser = SessionUser & Omit<UserProfile, 'firstNames' | 'lastNames'>

export function resolveUser(user: SessionUser, stored?: UserProfile): ResolvedUser {
  return {
    id: user.id,
    email: user.email,
    firstNames: stored?.firstNames ?? user.firstNames,
    lastNames: stored?.lastNames ?? user.lastNames,
    phone: stored?.phone ?? '',
    gender: stored?.gender ?? '',
    birthDate: stored?.birthDate ?? '',
    avatarUrl: stored?.avatarUrl ?? '',
  }
}

export function toProfile(user: ResolvedUser): UserProfile {
  const { firstNames, lastNames, phone, gender, birthDate, avatarUrl } = user
  return { firstNames, lastNames, phone, gender, birthDate, avatarUrl }
}

export function validateUserProfile(
  input: UserProfile,
): { success: true; data: UserProfile } | { success: false; errors: UserProfileErrors } {
  const result = UserProfileSchema.safeParse(input)
  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors: UserProfileErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof UserProfile
    if (!errors[field]) {
      errors[field] = issue.message
    }
  }
  return { success: false, errors }
}
