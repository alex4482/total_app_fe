import { z } from 'zod';

export const AuthTokensSchema = z.object({
  idToken: z.string(),
  refreshToken: z.string(),
});
export type AuthTokens = z.infer<typeof AuthTokensSchema>;

export const AuthStateSchema = z.discriminatedUnion('isAuthenticated', [
  z.object({
    isAuthenticated: z.literal(true),
    tokens: AuthTokensSchema,
  }),
  z.object({
    isAuthenticated: z.literal(false),
    tokens: z.null(),
  }),
]);
export type AuthState = z.infer<typeof AuthStateSchema>;

export const AuthResponseSchema = z.object({
  tokens: AuthTokensSchema,
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
