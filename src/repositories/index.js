import { prisma } from "../database/prisma.js";
import { BaseRepository } from "./baseRepository.js";

export const users = new BaseRepository(prisma.user);
export const tournaments = new BaseRepository(prisma.tournament);
export const transactions = new BaseRepository(prisma.transaction);
export const deposits = new BaseRepository(prisma.depositRequest);
export const withdraws = new BaseRepository(prisma.withdrawRequest);
export const squads = new BaseRepository(prisma.squad);
export const messages = new BaseRepository(prisma.chatMessage);
export const notifications = new BaseRepository(prisma.notification);
export const reports = new BaseRepository(prisma.report);
export const sponsors = new BaseRepository(prisma.sponsor);
export const settings = new BaseRepository(prisma.appSetting);
