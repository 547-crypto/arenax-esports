import { prisma } from "../database/prisma.js";

export const notificationService = {
  list(userId) { return prisma.notification.findMany({ where: { OR: [{ userId }, { userId: null }] }, orderBy: { createdAt: "desc" }, take: 100 }); },
  markAllRead(userId) { return prisma.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } }); },
  broadcast(data) { return prisma.notification.create({ data: { ...data, userId: null } }); }
};

export const leaderboardService = {
  async list(period = "allTime") {
    const users = await prisma.user.findMany({ orderBy: [{ wins: "desc" }, { earnings: "desc" }], take: 100 });
    return users.map((u, i) => ({ rank: i + 1, id: u.id, name: u.name, username: u.username, wins: u.wins, earnings: Number(u.earnings), period }));
  }
};

export const settingsService = {
  async all() {
    const rows = await prisma.appSetting.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  },
  set(key, value) {
    return prisma.appSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
};

export const adminService = {
  async dashboard() {
    const [users, tournaments, deposits, withdraws, reports] = await Promise.all([
      prisma.user.count(),
      prisma.tournament.count(),
      prisma.depositRequest.count({ where: { status: "pending" } }),
      prisma.withdrawRequest.count({ where: { status: "pending" } }),
      prisma.report.count({ where: { status: { in: ["open", "reviewing"] } } })
    ]);
    return { users, tournaments, pendingDeposits: deposits, pendingWithdraws: withdraws, openReports: reports };
  },
  analytics() {
    return prisma.transaction.groupBy({ by: ["kind", "status"], _sum: { amount: true }, _count: true });
  }
};
