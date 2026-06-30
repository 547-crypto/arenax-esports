import { prisma } from "../database/prisma.js";
import { ApiError } from "../utils/errors.js";

export const walletService = {
  async summary(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const txs = await prisma.transaction.groupBy({
      by: ["kind"],
      where: { userId, status: "success" },
      _sum: { amount: true }
    });
    const sum = (kind) => Number(txs.find((x) => x.kind === kind)?._sum.amount || 0);
    return {
      balance: Number(user.wallet),
      winningBalance: Number(user.winningBalance),
      bonusBalance: Number(user.bonusBalance),
      totalWon: Number(user.earnings),
      deposited: sum("deposit"),
      withdrawn: sum("withdraw")
    };
  },
  transactions(userId) {
    return prisma.transaction.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 100 });
  },
  depositRequest(userId, data) {
    return prisma.depositRequest.create({ data: { userId, amount: data.amount, utr: data.utr, screenshotUrl: data.screenshotUrl } });
  },
  async withdrawRequest(userId, data) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (Number(user.wallet) < Number(data.amount)) throw new ApiError(400, "Insufficient wallet balance");
    return prisma.withdrawRequest.create({ data: { userId, ...data } });
  },
  async reviewDeposit(id, reviewerId, { status, note }) {
    return prisma.$transaction(async (tx) => {
      const req = await tx.depositRequest.update({ where: { id }, data: { status, note, reviewedBy: reviewerId, reviewedAt: new Date() } });
      if (status === "approved") {
        await tx.user.update({ where: { id: req.userId }, data: { wallet: { increment: req.amount } } });
        await tx.transaction.create({ data: { userId: req.userId, kind: "deposit", status: "success", amount: req.amount, description: `Deposit approved UTR ${req.utr}`, reference: req.utr } });
      }
      return req;
    });
  },
  async reviewWithdraw(id, reviewerId, { status, note }) {
    return prisma.$transaction(async (tx) => {
      const req = await tx.withdrawRequest.findUnique({ where: { id } });
      if (!req) throw new ApiError(404, "Withdraw request not found");
      if (req.status !== "pending") throw new ApiError(409, "Request already reviewed");
      if (status === "approved") {
        const user = await tx.user.findUnique({ where: { id: req.userId } });
        if (Number(user.wallet) < Number(req.amount)) throw new ApiError(400, "Insufficient wallet balance");
        await tx.user.update({ where: { id: req.userId }, data: { wallet: { decrement: req.amount } } });
        await tx.transaction.create({ data: { userId: req.userId, kind: "withdraw", status: "success", amount: req.amount, description: "Withdrawal approved", reference: req.id } });
      }
      return tx.withdrawRequest.update({ where: { id }, data: { status, note, reviewedBy: reviewerId, reviewedAt: new Date() } });
    });
  }
};
