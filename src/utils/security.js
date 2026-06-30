import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const hashValue = (value) => crypto.createHash("sha256").update(value).digest("hex");
export const randomToken = () => crypto.randomBytes(48).toString("base64url");
export const referralCode = (username) =>
  `${username.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase()}${crypto.randomInt(1000, 9999)}`;
export const hashPassword = (password) => bcrypt.hash(password, 12);
export const comparePassword = (password, hash) => bcrypt.compare(password, hash);

export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL });
}

export function signRefreshToken(user, tokenId) {
  return jwt.sign({ sub: user.id, jti: tokenId, role: user.role }, env.JWT_REFRESH_SECRET, {
    expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d`
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}
