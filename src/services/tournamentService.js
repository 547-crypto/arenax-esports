import { prisma } from "../database/prisma.js";
import { ApiError } from "../utils/errors.js";

export const tournamentService = {
  list(userId, query = {}) {
    return prisma.tournament.findMany({
      where: {
        ...(query.status ? { status: query.status } : {}),
        ...(query.search ? { name: { contains: query.search, mode: "insensitive" } } : {})
      },
      include: { entries: userId ? { where: { userId } } : false, _count: { select: { entries: true } }, prizeRules: true },
      orderBy: { startsAt: "asc" }
    });
  },
  get(id, userId) {
    return prisma.tournament.findUnique({
      where: { id },
      include: { entries: userId ? { where: { userId } } : false, _count: { select: { entries: true } }, prizeRules: true, sponsors: { include: { sponsor: true } } }
    });
  },
  create(data) { return prisma.tournament.create({ data }); },
  update(id, data) { return prisma.tournament.update({ where: { id }, data }); },
  delete(id) { return prisma.tournament.delete({ where: { id } }); },
  async join(id, userId, squadId) {
    return prisma.$transaction(async (tx) => {
      const tournament = await tx.tournament.findUnique({ where: { id }, include: { _count: { select: { entries: true } } } });
      if (!tournament || tournament.status !== "upcoming") throw new ApiError(400, "Tournament is not open for joining");
      if (tournament._count.entries >= tournament.maxPlayers) throw new ApiError(409, "Tournament is full");
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (Number(user.wallet) < Number(tournament.fee)) throw new ApiError(400, "Insufficient wallet balance");
      if (Number(tournament.fee) > 0) {
        await tx.user.update({ where: { id: userId }, data: { wallet: { decrement: tournament.fee } } });
        await tx.transaction.create({ data: { userId, kind: "entry_fee", status: "success", amount: tournament.fee, description: `Entry fee for ${tournament.name}`, reference: id } });
      }
      return tx.tournamentEntry.create({ data: { tournamentId: id, userId, squadId } });
    });
  },
  async leave(id, userId) {
    return prisma.$transaction(async (tx) => {
      const entry = await tx.tournamentEntry.findUnique({ where: { tournamentId_userId: { tournamentId: id, userId } }, include: { tournament: true } });
      if (!entry) throw new ApiError(404, "Tournament entry not found");
      if (entry.tournament.status !== "upcoming") throw new ApiError(400, "Cannot leave after tournament starts");
      await tx.tournamentEntry.delete({ where: { id: entry.id } });
      if (Number(entry.tournament.fee) > 0) {
        await tx.user.update({ where: { id: userId }, data: { wallet: { increment: entry.tournament.fee } } });
        await tx.transaction.create({ data: { userId, kind: "refund", status: "success", amount: entry.tournament.fee, description: `Refund for ${entry.tournament.name}`, reference: id } });
      }
    });
  },
  releaseRoom(id, data) {
    return prisma.tournament.update({ where: { id }, data: { roomId: data.roomId, roomPassword: data.roomPassword, roomReleasedAt: new Date() } });
  }
};
