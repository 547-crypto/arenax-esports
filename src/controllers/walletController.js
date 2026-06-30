import { asyncHandler } from "../utils/asyncHandler.js";
import { walletService } from "../services/walletService.js";

export const walletController = {
  summary: asyncHandler(async (req, res) => res.json({ success: true, data: await walletService.summary(req.user.id) })),
  transactions: asyncHandler(async (req, res) => res.json({ success: true, data: await walletService.transactions(req.user.id) })),
  deposit: asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await walletService.depositRequest(req.user.id, req.validated.body) })),
  withdraw: asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await walletService.withdrawRequest(req.user.id, req.validated.body) })),
  reviewDeposit: asyncHandler(async (req, res) => res.json({ success: true, data: await walletService.reviewDeposit(req.params.id, req.user.id, req.validated.body) })),
  reviewWithdraw: asyncHandler(async (req, res) => res.json({ success: true, data: await walletService.reviewWithdraw(req.params.id, req.user.id, req.validated.body) }))
};
