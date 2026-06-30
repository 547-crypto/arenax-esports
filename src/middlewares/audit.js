import { prisma } from "../database/prisma.js";

export function audit(action, entity) {
  return async (req, _res, next) => {
    req.audit = async (entityId, metadata) => {
      await prisma.auditLog.create({
        data: {
          actorId: req.user?.id,
          action,
          entity,
          entityId,
          metadata,
          ip: req.ip
        }
      });
    };
    next();
  };
}
