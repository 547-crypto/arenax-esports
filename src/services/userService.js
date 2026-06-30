import { prisma } from "../database/prisma.js";
import { authService } from "./authService.js";

export const userService = {
  me(user) { return authService.publicUser(user); },
  async updateProfile(userId, data) {
    const allowed = (({ name, phone, avatarUrl }) => ({ name, phone, avatarUrl }))(data);
    return authService.publicUser(await prisma.user.update({ where: { id: userId }, data: allowed }));
  },
  async stats(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const rank = await prisma.user.count({ where: { wins: { gt: user.wins } } }) + 1;
    return { wins: user.wins, losses: user.losses, matches: user.matches, kills: user.kills, earnings: Number(user.earnings), rank };
  },
  async referral(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { referrals: true } });
    return { code: user.referralCode, inviteCount: user.referrals.length, history: user.referrals.map((r) => ({ id: r.id, name: r.name, joinedAt: r.createdAt })) };
  },
  achievements(userId) {
    return prisma.userAchievement.findMany({ where: { userId }, include: { achievement: true }, orderBy: { unlockedAt: "desc" } });
  }
};
