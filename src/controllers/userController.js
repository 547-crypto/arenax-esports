import { asyncHandler } from "../utils/asyncHandler.js";
import { userService } from "../services/userService.js";

export const userController = {
  me: asyncHandler(async (req, res) => res.json({ success: true, data: userService.me(req.user) })),
  update: asyncHandler(async (req, res) => res.json({ success: true, data: await userService.updateProfile(req.user.id, req.body) })),
  stats: asyncHandler(async (req, res) => res.json({ success: true, data: await userService.stats(req.user.id) })),
  referral: asyncHandler(async (req, res) => res.json({ success: true, data: await userService.referral(req.user.id) })),
  achievements: asyncHandler(async (req, res) => res.json({ success: true, data: await userService.achievements(req.user.id) }))
};
