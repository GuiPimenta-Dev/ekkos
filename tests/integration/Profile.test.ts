import MemoryBandRepository from "../../src/infra/repository/memory/MemoryBandRepository";
import MemoryBroker from "../../src/infra/broker/MemoryBroker";
import MemoryProfileRepository from "../../src/infra/repository/memory/MemoryProfileRepository";
import MemoryUserRepository from "../../src/infra/repository/memory/MemoryUserRepository";
import MemoryVideoRepository from "../../src/infra/repository/memory/MemoryVideoRepository";
import StorageGatewayFake from "../utils/mocks/StorageGatewayFake";
import app from "../../src/infra/http/Router";
import jwt from "jsonwebtoken";
import request from "supertest";

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

let authorization: string;
let id: string;
const password = "password";
const avatar = "tests/utils/files/avatar.jpeg";

beforeAll(async () => {
  let email = "email@test.com";
  await request(app).post("/user/create").send({ email, password });
  const response = await request(app).post("/user/login").send({ email, password });
  authorization = `Bearer ${response.body.token}`;
  await request(app)
    .post("/profile")
    .field("email", email)
    .field("password", password)
    .field("nick", "nick")
    .attach("avatar", avatar)
    .set({ authorization });
  email = "email2@test.com";
  await request(app).post("/user/create").send({ email, password });
  const { body } = await request(app).post("/user/login").send({ email, password });
  const decoded = jwt.verify(body.token, process.env.JWT_SECRET);
  id = decoded.id;
  await request(app)
    .post("/profile")
    .field("email", email)
    .field("password", password)
    .field("nick", "nick2")
    .attach("avatar", avatar)
    .set({ authorization: `Bearer ${body.token}` });
});

test("It should be able to create a profile", async () => {
  const email = "email@test.com";
  await request(app).post("/user/create").send({ email, password });
  const { body } = await request(app).post("/user/login").send({ email, password });
  const response = await request(app)
    .post("/profile")
    .field("email", email)
    .field("password", password)
    .field("nick", "random-nick")
    .attach("avatar", avatar)
    .set({ authorization: `Bearer ${body.token}` });
  expect(response.statusCode).toBe(201);
});

test("It should be able to get a profile", async () => {
  const response = await request(app).get(`/profile/${id}`).set({ authorization });
  expect(response.statusCode).toBe(200);
});

test("It should be able to follow a profile", async () => {
  const response = await request(app).post(`/profile/${id}/follow`).set({ authorization });
  expect(response.statusCode).toBe(200);
});

test("It should be able to unfollow a profile", async () => {
  await request(app).post(`/profile/${id}/follow`).set({ authorization });
  const { statusCode } = await request(app).post(`/profile/${id}/unfollow`).set({ authorization });
  expect(statusCode).toBe(200);
});
