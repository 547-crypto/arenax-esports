import http from "http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { attachSocket } from "./socket/index.js";
import { prisma } from "./database/prisma.js";

const app = createApp();
const server = http.createServer(app);
const io = attachSocket(server, env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(","));
app.set("io", io);

server.listen(env.PORT, () => {
  console.log(`ArenaX API listening on port ${env.PORT}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
