import jwt from "jsonwebtoken";
import { io as Client, Socket } from "socket.io-client";
import { createServer } from "http";
import { Server } from "socket.io";
import { createSocketIOChatGateway } from "../../../src/infra/gateway/SocketIOChatGateway";

describe("SocketIOChatGateway", () => {
  let io: Server;
  let client1: Socket;
  let client2: Socket;
  // eslint-disable-next-line jest/no-done-callback
  beforeAll((done) => {
    const server = createServer();
    io = createSocketIOChatGateway(server);
    server.listen(3000, () => {
      client1 = Client("http://localhost:3000", {
        query: {
          token: jwt.sign({ id: "client1" }, process.env.JWT_SECRET),
        },
      });

      client2 = Client("http://localhost:3000", {
        query: {
          token: jwt.sign({ id: "client2" }, process.env.JWT_SECRET),
        },
      });

      let client1Connected = false;
      let client2Connected = false;

      client1.on("connect", () => {
        client1Connected = true;
        if (client1Connected && client2Connected) {
          done();
        }
      });

      client2.on("connect", () => {
        client2Connected = true;
        if (client1Connected && client2Connected) {
          done();
        }
      });
    });
  });

  afterAll(async () => {
    io.close();
  });

  it("should be able to send a message", async () => {
    client1.send({ to: "token2", message: "Hello" });
    client2.on("messageReceived", (data) => {
      expect(data).toEqual({ from: "token1", message: "Hello" });
    });
  });
});
