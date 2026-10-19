import { z } from "zod";

// Acepta URLs absolutas http(s) o rutas relativas al sitio (ej. "/emprendimientos/foto.jpg").
export const AssetUrlSchema = z.union([
  z.url({ protocol: /^https?$/ }),
  z.string().regex(/^\/(?!\/)\S*$/, "Debe ser una URL http(s) o una ruta que empiece con '/'"),
]);

const SocialLinksSchema = z.object({
  facebook: z.url().optional(),
  instagram: z.url().optional(),
  tiktok: z.url().optional(),
  website: z.url().optional(),
});

const LocationSchema = z.object({
  district: z.string().min(1),
  province: z.string().min(1),
  department: z.string().min(1),
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
