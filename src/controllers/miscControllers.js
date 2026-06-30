import { asyncHandler } from "../utils/asyncHandler.js";
import { adminService, leaderboardService, notificationService, settingsService } from "../services/miscServices.js";
import { prisma } from "../database/prisma.js";

export const notificationController = {
  list: asyncHandler(async (req, res) => res.json({ success: true, data: await notificationService.list(req.user.id) })),
  markAllRead: asyncHandler(async (req, res) => res.json({ success: true, data: await notificationService.markAllRead(req.user.id) })),
  broadcast: asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await notificationService.broadcast(req.body) }))
};

export const leaderboardController = {
  list: asyncHandler(async (req, res) => res.json({ success: true, data: await leaderboardService.list(req.query.period) }))
};

export const settingsController = {
  all: asyncHandler(async (_req, res) => res.json({ success: true, data: await settingsService.all() })),
  set: asyncHandler(async (req, res) => res.json({ success: true, data: await settingsService.set(req.params.key, req.body.value) }))
};

export const reportController = {
  create: asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await prisma.report.create({ data: { reporterId: req.user.id, ...req.validated.body } }) })),
  list: asyncHandler(async (_req, res) => res.json({ success: true, data: await prisma.report.findMany({ orderBy: { createdAt: "desc" } }) })),
  update: asyncHandler(async (req, res) => res.json({ success: true, data: await prisma.report.update({ where: { id: req.params.id }, data: req.body }) }))
};

export const squadController = {
  list: asyncHandler(async (req, res) => res.json({ success: true, data: await prisma.squad.findMany({ where: { ownerId: req.user.id }, include: { members: true } }) })),
  create: asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await prisma.squad.create({ data: { ownerId: req.user.id, name: req.body.name, mode: req.body.mode, members: { create: { userId: req.user.id } } } }) })),
  update: asyncHandler(async (req, res) => res.json({ success: true, data: await prisma.squad.update({ where: { id: req.params.id }, data: { name: req.body.name, mode: req.body.mode } }) })),
  delete: asyncHandler(async (req, res) => {
    await prisma.squad.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
};

export const sponsorController = {
  list: asyncHandler(async (_req, res) => res.json({ success: true, data: await prisma.sponsor.findMany({ where: { active: true } }) })),
  create: asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await prisma.sponsor.create({ data: req.body }) })),
  update: asyncHandler(async (req, res) => res.json({ success: true, data: await prisma.sponsor.update({ where: { id: req.params.id }, data: req.body }) })),
  delete: asyncHandler(async (req, res) => {
    await prisma.sponsor.delete({ where: { id: req.params.id } });
    res.status(204).send();
  })
};

export const adminController = {
  dashboard: asyncHandler(async (_req, res) => res.json({ success: true, data: await adminService.dashboard() })),
  users: asyncHandler(async (_req, res) => res.json({ success: true, data: await prisma.user.findMany({ orderBy: { createdAt: "desc" } }) })),
  analytics: asyncHandler(async (_req, res) => res.json({ success: true, data: await adminService.analytics() }))
};
