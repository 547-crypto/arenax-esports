import { Router } from "express";
import { tournamentController } from "../controllers/tournamentController.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { tournamentSchema } from "../validators/commonValidators.js";

export const tournamentRoutes = Router();
const optionalAuth = (req, res, next) => (req.headers.authorization ? requireAuth(req, res, next) : next());
tournamentRoutes.get("/", optionalAuth, tournamentController.list);
tournamentRoutes.get("/:id", optionalAuth, tournamentController.get);
tournamentRoutes.post("/", requireAuth, requireRole("admin"), validate(tournamentSchema), tournamentController.create);
tournamentRoutes.patch("/:id", requireAuth, requireRole("admin"), validate(tournamentSchema.partial()), tournamentController.update);
tournamentRoutes.delete("/:id", requireAuth, requireRole("admin"), tournamentController.delete);
tournamentRoutes.post("/:id/join", requireAuth, tournamentController.join);
tournamentRoutes.delete("/:id/leave", requireAuth, tournamentController.leave);
tournamentRoutes.post("/:id/room-release", requireAuth, requireRole("admin"), tournamentController.releaseRoom);
