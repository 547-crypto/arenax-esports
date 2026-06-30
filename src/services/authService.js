import { prisma } from "../database/prisma.js";
import { ApiError } from "../utils/errors.js";
import {
  comparePassword,
  hashPassword,
  hashValue,
  randomToken,
  referralCode,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../utils/security.js";
import { sendMail } from "../utils/mail.js";
import { env } from "../config/env.js";

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  username: user.username,
  name: user.name,
  phone: user.phone,
  role: user.role,
  avatarUrl: user.avatarUrl,
  wallet: Number(user.wallet),
  winningBalance: Number(user.winningBalance),
  bonusBalance: Number(user.bonusBalance),
  wins: user.wins,
  losses: user.losses,
  matches: user.matches,
  kills: user.kills,
  earnings: Number(user.earnings),
  level: user.level,
  xp: user.xp,
  verified: user.verified,
  referralCode: user.referralCode
});

async function issueTokens(user, req) {
  const tokenId = randomToken();
  const refreshToken = signRefreshToken(user, tokenId);
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 86400000);
  await prisma.refreshToken.create({
    data: {
      tokenHash: hashValue(refreshToken),
      userId: user.id,
      expiresAt,
      userAgent: req.headers["user-agent"],
      ip: req.ip
    }
  });
  return { accessToken: signAccessToken(user), refreshToken };
}

export const authService = {
  async register(input, req) {
    const referredBy = input.referralCode
      ? await prisma.user.findUnique({ where: { referralCode: input.referralCode } })
      : null;
    const verifyToken = randomToken();
    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        username: input.username,
        name: input.name,
        phone: input.phone,
        passwordHash: await hashPassword(input.password),
        referralCode: referralCode(input.username),
        referredById: referredBy?.id,
        emailVerifyTokenHash: hashValue(verifyToken),
        emailVerifyExpiresAt: new Date(Date.now() + 24 * 3600000),
        notificationPreference: { create: {} },
        setting: { create: {} }
      }
    });
    await sendMail({
      to: user.email,
      subject: "Verify your ArenaX account",
      html: `<p>Verify your account: <a href="${env.APP_URL}/verify-email?token=${verifyToken}">Verify email</a></p>`
    });
    return { user: publicUser(user), ...(await issueTokens(user, req)) };
  },

  async login({ emailOrUsername, password }, req) {
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername }] }
    });
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      throw new ApiError(401, "Invalid credentials");
    }
    return { user: publicUser(user), ...(await issueTokens(user, req)) };
  },

  async refresh(refreshToken, req) {
    const payload = verifyRefreshToken(refreshToken);
    const record = await prisma.refreshToken.findUnique({ where: { tokenHash: hashValue(refreshToken) } });
    if (!record || record.revokedAt || record.expiresAt < new Date()) throw new ApiError(401, "Invalid refresh token");
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new ApiError(401, "Invalid refresh token");
    await prisma.refreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } });
    return { user: publicUser(user), ...(await issueTokens(user, req)) };
  },

  async logout(refreshToken) {
    if (refreshToken) {
      await prisma.refreshToken.updateMany({ where: { tokenHash: hashValue(refreshToken) }, data: { revokedAt: new Date() } });
    }
  },

  async verifyEmail(token) {
    const user = await prisma.user.findFirst({
      where: { emailVerifyTokenHash: hashValue(token), emailVerifyExpiresAt: { gt: new Date() } }
    });
    if (!user) throw new ApiError(400, "Invalid verification token");
    return publicUser(await prisma.user.update({
      where: { id: user.id },
      data: { verified: true, emailVerifyTokenHash: null, emailVerifyExpiresAt: null }
    }));
  },

  async forgotPassword(email) {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return;
    const token = randomToken();
    await prisma.user.update({
      where: { id: user.id },
      data: { resetTokenHash: hashValue(token), resetExpiresAt: new Date(Date.now() + 3600000) }
    });
    await sendMail({
      to: user.email,
      subject: "Reset your ArenaX password",
      html: `<p>Reset your password: <a href="${env.APP_URL}/reset-password?token=${token}">Reset password</a></p>`
    });
  },

  async resetPassword(token, password) {
    const user = await prisma.user.findFirst({ where: { resetTokenHash: hashValue(token), resetExpiresAt: { gt: new Date() } } });
    if (!user) throw new ApiError(400, "Invalid reset token");
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(password), resetTokenHash: null, resetExpiresAt: null }
    });
    await prisma.refreshToken.updateMany({ where: { userId: user.id }, data: { revokedAt: new Date() } });
  },

  async changePassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !(await comparePassword(currentPassword, user.passwordHash))) throw new ApiError(401, "Current password is incorrect");
    await prisma.user.update({ where: { id: userId }, data: { passwordHash: await hashPassword(newPassword) } });
    await prisma.refreshToken.updateMany({ where: { userId }, data: { revokedAt: new Date() } });
  },

  publicUser
};
