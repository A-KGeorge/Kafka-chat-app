import { Server, Socket } from "socket.io";
import { produceMessage } from "./helper.js";

interface CustomSocket extends Socket {
  room?: string;
}

export function setupSocket(io: Server) {
  io.use((socket: CustomSocket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.headers.room;
    if (!room) {
      return next(new Error("Room ID is required"));
    }
    socket.room = room;
    next();
  });
  io.on("connection", (socket: CustomSocket) => {
    // Join the room
    socket.join(socket.room!);

    console.log(`User connected: ${socket.id}`);
    socket.on("message", async (data) => {
      await produceMessage(process.env.KAFKA_TOPIC!, data);
      socket.to(socket.room!).emit("message", data);
    });
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
