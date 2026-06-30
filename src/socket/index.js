import { Server } from "socket.io";
import { prisma } from "../database/prisma.js";
import { verifyAccessToken } from "../utils/security.js";
import { chatService } from "../services/chatService.js";

const onlineUsers = new Map();

export function attachSocket(server, corsOrigin) {
  const io = new Server(server, { cors: { origin: corsOrigin, credentials: true } });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next();
      const payload = verifyAccessToken(token);
      socket.user = await prisma.user.findUnique({ where: { id: payload.sub } });
      next();
    } catch {
      next();
    }
  });

  io.on("connection", (socket) => {
    if (socket.user) onlineUsers.set(socket.user.id, socket.id);
    socket.join("world");
    socket.emit("online:count", onlineUsers.size);
    socket.broadcast.emit("online:count", onlineUsers.size);

    socket.on("chat:join", (channel) => socket.join(channel || "world"));
    socket.on("chat:typing", ({ channel = "world", typing }) => socket.to(channel).emit("chat:typing", { userId: socket.user?.id, typing }));
    socket.on("chat:send", async (payload, ack) => {
      try {
        if (!socket.user) throw new Error("Authentication required");
        const message = await chatService.create(socket.user.id, payload);
        io.to(message.channel).emit("chat:message", message);
        ack?.({ success: true, data: message });
      } catch (error) {
        ack?.({ success: false, message: error.message });
      }
    });
    socket.on("disconnect", () => {
      if (socket.user) onlineUsers.delete(socket.user.id);
      io.emit("online:count", onlineUsers.size);
    });
  });

  return io;
}
