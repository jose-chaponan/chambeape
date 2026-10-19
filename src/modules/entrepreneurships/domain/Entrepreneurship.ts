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

export const EntrepreneurshipSchema = z.object({
  id: z.string().min(1),
  ownerUserId: z.string().min(1),
  ownerDni: z.string().regex(/^\d{8}$/),
  businessName: z.string().min(1),
  shortDescription: z.string().min(1).max(100),
  longDescription: z.string().min(1).max(400),
  categoryId: z.string().min(1),
  rating: z.number().min(0).max(5),
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
