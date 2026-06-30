import { Router } from "express";
import { userController } from "../controllers/userController.js";
import { requireAuth } from "../middlewares/auth.js";

export const userRoutes = Router();
userRoutes.use(requireAuth);
userRoutes.get("/me", userController.me);
userRoutes.patch("/me", userController.update);
userRoutes.get("/me/stats", userController.stats);
userRoutes.get("/me/referral", userController.referral);
userRoutes.get("/me/achievements", userController.achievements);
