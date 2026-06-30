-- CreateSchema is managed by PostgreSQL public schema.
CREATE TYPE "Role" AS ENUM ('user', 'moderator', 'admin');
CREATE TYPE "TournamentStatus" AS ENUM ('upcoming', 'live', 'completed', 'cancelled');
CREATE TYPE "TeamMode" AS ENUM ('solo', 'duo', 'squad');
CREATE TYPE "TxKind" AS ENUM ('deposit', 'withdraw', 'entry_fee', 'prize', 'referral', 'bonus', 'adjustment', 'refund');
CREATE TYPE "TxStatus" AS ENUM ('pending', 'success', 'failed', 'rejected');
CREATE TYPE "RequestStatus" AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE "ChatChannel" AS ENUM ('world', 'admin', 'tournament');
CREATE TYPE "ReportType" AS ENUM ('cheating', 'abuse', 'spam', 'other');
CREATE TYPE "ReportStatus" AS ENUM ('open', 'reviewing', 'resolved', 'rejected');

-- This migration mirrors prisma/schema.prisma. Generate exact SQL for your target
-- database with `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script`
-- if your Prisma version changes SQL formatting.
