import { Prisma } from "@prisma/client";

export function notFoundHandler(req, _res, next) {
  const err = new Error(`Route ${req.method} ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
}

export function errorHandler(err, _req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let details = err.details;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      message = "Unique constraint violation";
      details = err.meta;
    }
    if (err.code === "P2025") {
      statusCode = 404;
      message = "Record not found";
    }
  }

  res.status(statusCode).json({ success: false, message, details });
}
