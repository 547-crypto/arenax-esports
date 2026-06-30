import { asyncHandler } from "../utils/asyncHandler.js";
import { authService } from "../services/authService.js";

export const authController = {
  register: asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await authService.register(req.validated.body, req) })),
  login: asyncHandler(async (req, res) => res.json({ success: true, data: await authService.login(req.validated.body, req) })),
  refresh: asyncHandler(async (req, res) => res.json({ success: true, data: await authService.refresh(req.validated.body.refreshToken, req) })),
  logout: asyncHandler(async (req, res) => {
    await authService.logout(req.body.refreshToken);
    res.status(204).send();
  }),
  verifyEmail: asyncHandler(async (req, res) => res.json({ success: true, data: await authService.verifyEmail(req.body.token || req.query.token) })),
  forgotPassword: asyncHandler(async (req, res) => {
    await authService.forgotPassword(req.validated.body.email);
    res.json({ success: true, message: "If the email exists, reset instructions have been sent" });
  }),
  resetPassword: asyncHandler(async (req, res) => {
    await authService.resetPassword(req.validated.body.token, req.validated.body.password);
    res.status(204).send();
  }),
  changePassword: asyncHandler(async (req, res) => {
    await authService.changePassword(req.user.id, req.validated.body.currentPassword, req.validated.body.newPassword);
    res.status(204).send();
  })
};
