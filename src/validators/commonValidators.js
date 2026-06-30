import { z } from "zod";

export const idParam = z.object({ params: z.object({ id: z.string().min(1) }) });
export const pagination = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20)
  })
});

export const tournamentSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    game: z.string().min(2),
    icon: z.string().optional(),
    description: z.string().optional(),
    prize: z.coerce.number().nonnegative(),
    fee: z.coerce.number().nonnegative().default(0),
    maxPlayers: z.coerce.number().int().positive(),
    status: z.enum(["upcoming", "live", "completed", "cancelled"]).default("upcoming"),
    mode: z.enum(["solo", "duo", "squad"]),
    region: z.string().optional(),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date().optional(),
    roomId: z.string().optional(),
    roomPassword: z.string().optional(),
    youtubeLiveUrl: z.string().url().optional(),
    replayUrl: z.string().url().optional(),
    privateCode: z.string().optional(),
    bannerUrl: z.string().url().optional(),
    gradientStart: z.string().optional(),
    gradientEnd: z.string().optional()
  })
});

export const amountSchema = z.object({ body: z.object({ amount: z.coerce.number().positive() }) });
export const depositSchema = z.object({
  body: z.object({ amount: z.coerce.number().positive(), utr: z.string().min(6), screenshotUrl: z.string().url().optional() })
});
export const withdrawSchema = z.object({
  body: z.object({
    amount: z.coerce.number().positive(),
    upiId: z.string().optional(),
    bankAccount: z.string().optional(),
    ifsc: z.string().optional()
  }).refine((v) => v.upiId || (v.bankAccount && v.ifsc), "UPI ID or bank details are required")
});
export const reviewSchema = z.object({ body: z.object({ status: z.enum(["approved", "rejected"]), note: z.string().optional() }) });
export const messageSchema = z.object({
  body: z.object({
    channel: z.enum(["world", "admin", "tournament"]).default("world"),
    tournamentId: z.string().optional(),
    body: z.string().min(1).max(1000),
    replyToId: z.string().optional()
  })
});
export const reportSchema = z.object({
  body: z.object({
    targetUserId: z.string().optional(),
    type: z.enum(["cheating", "abuse", "spam", "other"]),
    description: z.string().min(5),
    evidenceUrl: z.string().url().optional()
  })
});
