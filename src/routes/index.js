import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../utils/swagger.js";
import { authRoutes } from "./authRoutes.js";
import { userRoutes } from "./userRoutes.js";
import { walletRoutes } from "./walletRoutes.js";
import { tournamentRoutes } from "./tournamentRoutes.js";
import { chatRoutes } from "./chatRoutes.js";
import { miscRoutes } from "./miscRoutes.js";

export const routes = Router();
routes.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/wallet", walletRoutes);
routes.use("/tournaments", tournamentRoutes);
routes.use("/chat", chatRoutes);
routes.use("/", miscRoutes);
