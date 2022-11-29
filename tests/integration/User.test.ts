import request from "supertest";
import MemoryBroker from "../../src/infra/broker/MemoryBroker";
import MemoryBandRepository from "../../src/infra/repository/MemoryBandRepository";
import MemoryProfileRepository from "../../src/infra/repository/MemoryProfileRepository";
import MemoryUserRepository from "../../src/infra/repository/MemoryUserRepository";
import MemoryVideoRepository from "../../src/infra/repository/MemoryVideoRepository";
import StorageGatewayFake from "../utils/mocks/gateway/StorageGatewayFake";
import app from "../../src/infra/http/Router";

jest.mock("../../src/Config", () => ({
  ...(jest.requireActual("../../src/Config") as {}),
  config: {
    profileRepository: new MemoryProfileRepository(),
    userRepository: new MemoryUserRepository(),
    videoRepository: new MemoryVideoRepository(),
    bandRepository: new MemoryBandRepository(),
    broker: new MemoryBroker(),
    storage: new StorageGatewayFake(),
  },
}));

test("It should be able to create a user", async () => {
  const response = await request(app)
    .post("/user/create")
    .send({ email: "random_email@gmail.com", password: "123456" });
  expect(response.statusCode).toBe(201);
});

test("It should be able to login a user", async () => {
  await request(app).post("/user/create").send({ email: "random_email@gmail.com", password: "123456" });
  const response = await request(app).post("/user/login").send({ email: "random_email@gmail.com", password: "123456" });
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("token");
});
