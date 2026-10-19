import { z } from 'zod'
import { EntrepreneurshipSchema, type Entrepreneurship } from './Entrepreneurship'
import { LIMA_DISTRICTS } from './LimaDistricts'

export const MAX_PRODUCTS = 12
export const MAX_GALLERY_PHOTOS = 5
export const SHORT_DESCRIPTION_MAX = 100
export const LONG_DESCRIPTION_MAX = 400

/** Lo que el formulario edita: todo como texto (vacío = sin dato) para que los campos sean siempre controlados. */
export interface EntrepreneurshipForm {
  businessName: string
  categoryId: string
  shortDescription: string
  longDescription: string
  products: string[]
  district: string
  whatsapp: string
  facebook: string
  instagram: string
  tiktok: string
  website: string
  ruc: string
  ownerDni: string
  coverImageUrl: string
  photoUrls: string[]
}

export type EntrepreneurshipFormErrors = Partial<Record<keyof EntrepreneurshipForm, string>>

export const emptyEntrepreneurshipForm: EntrepreneurshipForm = {
  businessName: '',
  categoryId: '',
  shortDescription: '',
  longDescription: '',
  products: [],
  district: '',
  whatsapp: '',
  facebook: '',
  instagram: '',
  tiktok: '',
  website: '',
  ruc: '',
  ownerDni: '',
  coverImageUrl: '',
  photoUrls: [],
}

const HTTPS_MESSAGE = 'Ingresa un enlace completo que empiece con https://'

// Enlace opcional: vacío o http(s). Se rechaza cualquier otro esquema (javascript:, data:, etc.).
const optionalLink = z
  .string()
  .trim()
  .refine((value) => {
    if (value === '') return true
    try {
      return ['http:', 'https:'].includes(new URL(value).protocol)
    } catch {
      return false
    }
  }, HTTPS_MESSAGE)

const FormSchema = z.object({
  businessName: z.string().trim().min(2, 'Ingresa el nombre de tu emprendimiento.').max(60, 'Usa máximo 60 caracteres.'),
  categoryId: z.string().min(1, 'Elige una categoría.'),
  shortDescription: z
    .string()
    .trim()
    .min(1, 'Cuéntanos en una frase qué haces.')
    .max(SHORT_DESCRIPTION_MAX, `Usa máximo ${SHORT_DESCRIPTION_MAX} caracteres.`),
  longDescription: z
    .string()
    .trim()
    .min(1, 'Cuéntanos tu historia.')
    .max(LONG_DESCRIPTION_MAX, `Usa máximo ${LONG_DESCRIPTION_MAX} caracteres.`),
  products: z
    .array(z.string().trim().min(1).max(60))
    .min(1, 'Agrega al menos un producto o servicio.')
    .max(MAX_PRODUCTS, `Puedes agregar hasta ${MAX_PRODUCTS}.`),
  district: z.enum(LIMA_DISTRICTS, 'Elige el distrito de Lima donde atiendes.'),
  whatsapp: z.string().trim().regex(/^(9\d{8})?$/, 'Ingresa un celular peruano de 9 dígitos que empiece con 9.'),
  facebook: optionalLink,
  instagram: optionalLink,
  tiktok: optionalLink,
  website: optionalLink,
  ruc: z.string().trim().regex(/^(\d{11})?$/, 'El RUC tiene 11 dígitos.'),
  ownerDni: z.string().trim().regex(/^\d{8}$/, 'El DNI tiene 8 dígitos.'),
  coverImageUrl: z.string().min(1, 'Sube una foto de portada.'),
  photoUrls: z.array(z.string()).max(MAX_GALLERY_PHOTOS, `Puedes subir hasta ${MAX_GALLERY_PHOTOS} fotos.`),
})

export function validateEntrepreneurshipForm(
  form: EntrepreneurshipForm,
): { success: true; data: EntrepreneurshipForm } | { success: false; errors: EntrepreneurshipFormErrors } {
  const result = FormSchema.safeParse(form)
  if (result.success) {
    return { success: true, data: { ...result.data } }
  }

  const errors: EntrepreneurshipFormErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof EntrepreneurshipForm
    errors[field] ??= issue.message
  }
  return { success: false, errors }
}

export function toEntrepreneurshipForm(entrepreneurship: Entrepreneurship): EntrepreneurshipForm {
  const { socialLinks } = entrepreneurship
  return {
    businessName: entrepreneurship.businessName,
    categoryId: entrepreneurship.categoryId,
    shortDescription: entrepreneurship.shortDescription,
    longDescription: entrepreneurship.longDescription,
    products: [...entrepreneurship.products],
    district: entrepreneurship.location.district,
    whatsapp: socialLinks.whatsapp ?? '',
    facebook: socialLinks.facebook ?? '',
    instagram: socialLinks.instagram ?? '',
    tiktok: socialLinks.tiktok ?? '',
    website: socialLinks.website ?? '',
    ruc: entrepreneurship.ruc ?? '',
    ownerDni: entrepreneurship.ownerDni,
    coverImageUrl: entrepreneurship.coverImageUrl ?? '',
    photoUrls: [...entrepreneurship.photoUrls],
  }
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replaceAll(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '')
    .slice(0, 40)
}

function createId(businessName: string): string {
  const suffix = globalThis.crypto?.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10)
  return `ent-${slugify(businessName) || 'emprendimiento'}-${suffix}`
}

const present = (value: string): string | undefined => (value.trim() === '' ? undefined : value.trim())

/**
 * Arma el emprendimiento a guardar. Al editar conserva lo que el formulario no toca
 * (id, dueño, calificación y verificación); al crear parte de una calificación en cero.
 */
export function buildEntrepreneurship(
  form: EntrepreneurshipForm,
  ownerUserId: string,
  existing?: Entrepreneurship,
): Entrepreneurship {
  return EntrepreneurshipSchema.parse({
    ...existing,
    id: existing?.id ?? createId(form.businessName),
    ownerUserId: existing?.ownerUserId ?? ownerUserId,
    ownerDni: form.ownerDni.trim(),
    businessName: form.businessName.trim(),
    shortDescription: form.shortDescription.trim(),
    longDescription: form.longDescription.trim(),
    categoryId: form.categoryId,
    rating: existing?.rating ?? 0,
    verified: existing?.verified ?? false,
    ruc: present(form.ruc),
    products: form.products.map((product) => product.trim()),
    location: { district: form.district, province: 'Lima', department: 'Lima' },
    coverImageUrl: form.coverImageUrl,
    photoUrls: form.photoUrls,
    socialLinks: {
      facebook: present(form.facebook),
      instagram: present(form.instagram),
      tiktok: present(form.tiktok),
      website: present(form.website),
      whatsapp: present(form.whatsapp),
    },
  })
}
