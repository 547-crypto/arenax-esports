import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { changePasswordSchema, forgotSchema, loginSchema, registerSchema, resetSchema, tokenSchema } from "../validators/authValidator.js";

export const authRoutes = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a user
 */
authRoutes.post("/register", validate(registerSchema), authController.register);
authRoutes.post("/login", validate(loginSchema), authController.login);
authRoutes.post("/refresh", validate(tokenSchema), authController.refresh);
authRoutes.post("/logout", authController.logout);
authRoutes.post("/verify-email", authController.verifyEmail);
authRoutes.post("/forgot-password", validate(forgotSchema), authController.forgotPassword);
authRoutes.post("/reset-password", validate(resetSchema), authController.resetPassword);
authRoutes.post("/change-password", requireAuth, validate(changePasswordSchema), authController.changePassword);
