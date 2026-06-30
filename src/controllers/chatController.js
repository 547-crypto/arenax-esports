import { asyncHandler } from "../utils/asyncHandler.js";
import { chatService } from "../services/chatService.js";

export const chatController = {
  list: asyncHandler(async (req, res) => res.json({ success: true, data: await chatService.list(req.query) })),
  create: asyncHandler(async (req, res) => {
    const message = await chatService.create(req.user.id, req.validated.body);
    req.app.get("io")?.to(message.channel).emit("chat:message", message);
    res.status(201).json({ success: true, data: message });
  }),
  delete: asyncHandler(async (req, res) => res.json({ success: true, data: await chatService.delete(req.params.id, req.user) })),
  pin: asyncHandler(async (req, res) => res.json({ success: true, data: await chatService.pin(req.params.id, req.body.pinned === true) })),
  read: asyncHandler(async (req, res) => res.json({ success: true, data: await chatService.read(req.params.id, req.user.id) }))
};
