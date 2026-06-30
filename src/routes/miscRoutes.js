import { Router } from "express";
import {
  adminController,
  leaderboardController,
  notificationController,
  reportController,
  settingsController,
  sponsorController,
  squadController
} from "../controllers/miscControllers.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { reportSchema } from "../validators/commonValidators.js";

export const miscRoutes = Router();

miscRoutes.get("/leaderboards", leaderboardController.list);
miscRoutes.get("/settings", settingsController.all);
miscRoutes.get("/sponsors", sponsorController.list);

miscRoutes.use("/notifications", requireAuth);
miscRoutes.get("/notifications", notificationController.list);
miscRoutes.post("/notifications/mark-all-read", notificationController.markAllRead);

miscRoutes.use("/squads", requireAuth);
miscRoutes.get("/squads", squadController.list);
miscRoutes.post("/squads", squadController.create);
miscRoutes.patch("/squads/:id", squadController.update);
miscRoutes.delete("/squads/:id", squadController.delete);

miscRoutes.post("/reports", requireAuth, validate(reportSchema), reportController.create);

miscRoutes.use("/admin", requireAuth, requireRole("admin"));
miscRoutes.get("/admin/dashboard", adminController.dashboard);
miscRoutes.get("/admin/users", adminController.users);
miscRoutes.get("/admin/analytics", adminController.analytics);
miscRoutes.get("/admin/reports", reportController.list);
miscRoutes.patch("/admin/reports/:id", reportController.update);
miscRoutes.post("/admin/broadcasts", notificationController.broadcast);
miscRoutes.put("/admin/settings/:key", settingsController.set);
miscRoutes.post("/admin/sponsors", sponsorController.create);
miscRoutes.patch("/admin/sponsors/:id", sponsorController.update);
miscRoutes.delete("/admin/sponsors/:id", sponsorController.delete);
