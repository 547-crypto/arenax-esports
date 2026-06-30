import { prisma } from "../database/prisma.js";
import { ApiError } from "../utils/errors.js";

export const chatService = {
  list({ channel = "world", tournamentId, take = 50 }) {
    return prisma.chatMessage.findMany({
      where: { channel, tournamentId, deletedAt: null },
      include: { user: { select: { id: true, username: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: "desc" },
      take: Number(take)
    });
  },
  create(userId, data) {
    return prisma.chatMessage.create({
      data: { userId, channel: data.channel, tournamentId: data.tournamentId, body: data.body, replyToId: data.replyToId },
      include: { user: { select: { id: true, username: true, name: true, avatarUrl: true } } }
    });
  },
  async delete(id, user) {
    const msg = await prisma.chatMessage.findUnique({ where: { id } });
    if (!msg) throw new ApiError(404, "Message not found");
    if (msg.userId !== user.id && !["admin", "moderator"].includes(user.role)) throw new ApiError(403, "Cannot delete this message");
    return prisma.chatMessage.update({ where: { id }, data: { deletedAt: new Date(), deletedById: user.id } });
  },
  pin(id, pinned) {
    return prisma.chatMessage.update({ where: { id }, data: { pinned } });
  },
  read(messageId, userId) {
    return prisma.chatReceipt.upsert({ where: { messageId_userId: { messageId, userId } }, update: { readAt: new Date() }, create: { messageId, userId } });
  }
};
