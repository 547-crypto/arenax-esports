import { Router } from "express";
import { chatController } from "../controllers/chatController.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { messageSchema } from "../validators/commonValidators.js";

export const chatRoutes = Router();
chatRoutes.get("/messages", chatController.list);
chatRoutes.post("/messages", requireAuth, validate(messageSchema), chatController.create);
chatRoutes.delete("/messages/:id", requireAuth, chatController.delete);
chatRoutes.patch("/messages/:id/pin", requireAuth, requireRole("admin", "moderator"), chatController.pin);
chatRoutes.post("/messages/:id/read", requireAuth, chatController.read);
