import { Router } from "express";
import { walletController } from "../controllers/walletController.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { depositSchema, reviewSchema, withdrawSchema } from "../validators/commonValidators.js";

export const walletRoutes = Router();
walletRoutes.use(requireAuth);
walletRoutes.get("/", walletController.summary);
walletRoutes.get("/transactions", walletController.transactions);
walletRoutes.post("/deposit-requests", validate(depositSchema), walletController.deposit);
walletRoutes.post("/withdraw-requests", validate(withdrawSchema), walletController.withdraw);
walletRoutes.patch("/deposit-requests/:id/review", requireRole("admin"), validate(reviewSchema), walletController.reviewDeposit);
walletRoutes.patch("/withdraw-requests/:id/review", requireRole("admin"), validate(reviewSchema), walletController.reviewWithdraw);
