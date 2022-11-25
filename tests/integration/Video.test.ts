import MemoryBroker from "../../src/infra/broker/MemoryBroker";
import MemoryProfileRepository from "../../src/infra/repository/memory/MemoryProfileRepository";
import MemoryUserRepository from "../../src/infra/repository/memory/MemoryUserRepository";
import MemoryVideoRepository from "../../src/infra/repository/memory/MemoryVideoRepository";
import StorageGatewayFake from "../utils/mocks/StorageGatewayFake";
import app from "../../src/infra/http/Router";
import request from "supertest";

jest.mock("../../src/Config", () => ({
  ...(jest.requireActual("../../src/Config") as {}),
  config: {
    profileRepository: new MemoryProfileRepository(),
    userRepository: new MemoryUserRepository(),
    videoRepository: new MemoryVideoRepository(),
    broker: new MemoryBroker(),
    storage: new StorageGatewayFake(),
  },
}));

let authorization: string;
let videoId: string;

const testFile = "tests/utils/files/video.mp4";

beforeAll(async () => {
  const email = "email@gmail.com";
  const password = "123456";
  await request(app).post("/user/create").send({ email, password });
  const response = await request(app).post("/user/login").send({ email, password });
  authorization = `Bearer ${response.body.token}`;
  await request(app).post("/profile").send({ email, password, nick: "nick" }).set({ authorization });
  const { body } = await request(app)
    .post("/video")
    .field("title", "title")
    .field("description", "description")
    .attach("file", testFile)
    .set({ authorization });
  videoId = body.videoId;
});

test("It should be able to post a video", async () => {
  const { statusCode } = await request(app)
    .post("/video")
    .field("title", "title")
    .field("description", "description")
    .attach("file", testFile)
    .set({ authorization });
  expect(statusCode).toBe(200);
});

test("It should be able to get a video", async () => {
  const { statusCode } = await request(app).get(`/video/${videoId}`).set({ authorization });
  expect(statusCode).toBe(200);
});

test("It should be able to like a video", async () => {
  const { statusCode } = await request(app).post(`/video/${videoId}/like`).set({ authorization });
  expect(statusCode).toBe(200);
});

test("It should be able to unlike a video", async () => {
  await request(app).post(`/video/${videoId}/like`).set({ authorization });
  const { statusCode } = await request(app).post(`/video/${videoId}/unlike`).set({ authorization });
  expect(statusCode).toBe(200);
});

test("It should be able to comment a video", async () => {
  const { statusCode } = await request(app)
    .post(`/video/${videoId}/comment`)
    .send({ text: "text" })
    .set({ authorization });
  expect(statusCode).toBe(200);
});

test("It should be able to delete a comment in a video", async () => {
  const { body } = await request(app).post(`/video/${videoId}/comment`).send({ text: "text" }).set({ authorization });
  const { statusCode } = await request(app).delete(`/video/${body.videoId}/comment`).set({ authorization });
  expect(statusCode).toBe(200);
});
