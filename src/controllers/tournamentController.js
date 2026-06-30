import { asyncHandler } from "../utils/asyncHandler.js";
import { tournamentService } from "../services/tournamentService.js";

const toDto = (t) => t && ({
  ...t,
  prize: Number(t.prize),
  fee: Number(t.fee),
  max: t.maxPlayers,
  joined: t._count?.entries ?? t.entries?.length ?? 0,
  start: t.startsAt,
  isJoined: Boolean(t.entries?.length),
  gradient: [t.gradientStart || "#4F46E5", t.gradientEnd || "#7C3AED"],
  prizeRules: t.prizeRules?.map((r) => ({ ...r, percent: Number(r.percent) }))
});

export const tournamentController = {
  list: asyncHandler(async (req, res) => {
    const items = await tournamentService.list(req.user?.id, req.query);
    res.json({ success: true, data: items.map(toDto) });
  }),
  get: asyncHandler(async (req, res) => res.json({ success: true, data: toDto(await tournamentService.get(req.params.id, req.user?.id)) })),
  create: asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await tournamentService.create(req.validated.body) })),
  update: asyncHandler(async (req, res) => res.json({ success: true, data: await tournamentService.update(req.params.id, req.validated.body) })),
  delete: asyncHandler(async (req, res) => {
    await tournamentService.delete(req.params.id);
    res.status(204).send();
  }),
  join: asyncHandler(async (req, res) => res.status(201).json({ success: true, data: await tournamentService.join(req.params.id, req.user.id, req.body.squadId) })),
  leave: asyncHandler(async (req, res) => {
    await tournamentService.leave(req.params.id, req.user.id);
    res.status(204).send();
  }),
  releaseRoom: asyncHandler(async (req, res) => res.json({ success: true, data: await tournamentService.releaseRoom(req.params.id, req.body) }))
};
