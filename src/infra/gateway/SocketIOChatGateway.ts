import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { Server } from "http";

interface UserSocket extends Socket {
  userId: string;
}

export const createSocketIOChatGateway = (server: Server) => {
  const io = new SocketIOServer(server);

  const onlineUsers = {};

  io.use((socket: UserSocket, next) => {
    try {
      const decoded: any = jwt.verify(
        socket.handshake.query.token as string,
        process.env.JWT_SECRET,
      );
      // eslint-disable-next-line no-param-reassign
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: UserSocket) => {
    onlineUsers[socket.userId] = socket;

    socket.on("message", ({ to, message }) => {
      if (onlineUsers[to]) {
        onlineUsers[to].emit("messageReceived", {
          from: socket.userId,
          message,
        });
      }
    });

    socket.on("disconnect", () => {
      delete onlineUsers[socket.userId];
    });
  });

  return io;
};
