import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().min(1),
  email: z.email(),
  password: z.string().min(1),
  firstNames: z.string().min(1),
  lastNames: z.string().min(1),
});

export type User = z.infer<typeof UserSchema>;

// Usuario sin datos sensibles: es lo único que puede salir de la capa de autenticación.
export const SessionUserSchema = UserSchema.omit({ password: true });

export type SessionUser = z.infer<typeof SessionUserSchema>;

export function toSessionUser({ id, email, firstNames, lastNames }: User): SessionUser {
  return { id, email, firstNames, lastNames };
}
