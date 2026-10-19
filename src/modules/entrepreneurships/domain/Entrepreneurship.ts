import { z } from "zod";
import { LIMA_DISTRICTS } from "./LimaDistricts";

// Enlaces que escribe el usuario: solo http(s), nunca "javascript:" u otros esquemas que se ejecutarían al hacer clic.
const HttpUrlSchema = z.url({ protocol: /^https?$/ });

export const MAX_IMAGE_DATA_URL_LENGTH = 400_000;

// Acepta URLs absolutas http(s), rutas relativas al sitio (ej. "/emprendimientos/foto.jpg")
// o imágenes subidas por el usuario, guardadas como data URL en localStorage.
export const AssetUrlSchema = z.union([
  HttpUrlSchema,
  z.string().regex(/^\/(?!\/)\S*$/, "Debe ser una URL http(s) o una ruta que empiece con '/'"),
  z
    .string()
    .max(MAX_IMAGE_DATA_URL_LENGTH)
    .regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/),
]);

const SocialLinksSchema = z.object({
  facebook: HttpUrlSchema.optional(),
  instagram: HttpUrlSchema.optional(),
  tiktok: HttpUrlSchema.optional(),
  website: HttpUrlSchema.optional(),
  // Número de celular peruano (9 dígitos) al que apunta el botón de WhatsApp.
  whatsapp: z
    .string()
    .regex(/^9\d{8}$/)
    .optional(),
});

// Chambea Pe solo está disponible en Lima por ahora: cualquier otra provincia o departamento es un error de datos.
const LocationSchema = z.object({
  district: z.enum(LIMA_DISTRICTS),
  province: z.literal("Lima", "Chambea Pe solo está disponible en Lima por ahora."),
  department: z.literal("Lima", "Chambea Pe solo está disponible en Lima por ahora."),
});

export type EntrepreneurshipLocation = z.infer<typeof LocationSchema>;

export const EntrepreneurshipSchema = z.object({
  id: z.string().min(1),
  ownerUserId: z.string().min(1),
  ownerDni: z.string().regex(/^\d{8}$/),
  businessName: z.string().min(1),
  shortDescription: z.string().min(1).max(100),
  longDescription: z.string().min(1).max(400),
  categoryId: z.string().min(1),
  rating: z.number().min(0).max(5),
  // Insignia de "Emprendimiento verificado"; los que no la tienen simplemente la omiten.
  verified: z.boolean().default(false),
  // Productos o servicios que ofrece, a modo de ejemplo (la portal es solo vitrina).
  products: z.array(z.string().min(1)).min(1),
  location: LocationSchema,
  ruc: z
    .string()
    .regex(/^\d{11}$/)
    .optional(),
  logoUrl: AssetUrlSchema.optional(),
  coverImageUrl: AssetUrlSchema.optional(),
  socialLinks: SocialLinksSchema,
  photoUrls: z.array(AssetUrlSchema),
});

export type Entrepreneurship = z.infer<typeof EntrepreneurshipSchema>;
