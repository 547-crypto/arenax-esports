import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
    name: z.string().min(2).max(80),
    password: z.string().min(8).max(128),
    phone: z.string().min(7).max(20).optional(),
    referralCode: z.string().optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    emailOrUsername: z.string().min(3),
    password: z.string().min(8),
    rememberMe: z.boolean().default(false)
  })
});

export const tokenSchema = z.object({ body: z.object({ refreshToken: z.string().min(20) }) });
export const forgotSchema = z.object({ body: z.object({ email: z.string().email() }) });
export const resetSchema = z.object({ body: z.object({ token: z.string(), password: z.string().min(8).max(128) }) });
export const changePasswordSchema = z.object({
  body: z.object({ currentPassword: z.string().min(8), newPassword: z.string().min(8).max(128) })
});
