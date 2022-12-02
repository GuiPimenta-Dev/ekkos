import MemoryBroker from "../../src/infra/broker/MemoryBroker";
import MemoryProfileRepository from "../../src/infra/repository/MemoryProfileRepository";
import MemoryUserRepository from "../../src/infra/repository/MemoryUserRepository";
import MemoryVideoRepository from "../../src/infra/repository/MemoryVideoRepository";
import StorageGatewayFake from "../utils/mocks/gateway/StorageGatewayFake";
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
const videoId = "videoId";

const video = "tests/utils/files/video.mp4";

beforeAll(async () => {
  const email = "user_1@test.com";
  const password = "123456";
  const { body } = await request(app).post("/user/login").send({ email, password });
  authorization = `Bearer ${body.token}`;
});

test("It should be able to post a video", async () => {
  const response = await request(app)
    .post("/video")
    .field("title", "title")
    .field("description", "description")
    .attach("video", video)
    .set({ authorization });
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("videoId");
});

test("It should be able to get a video", async () => {
  const response = await request(app).get(`/video/${videoId}`).set({ authorization });
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({
    videoId: "videoId",
    profileId: "1",
    title: "title",
    description: "description",
    url: "url",
    likes: 1,
    comments: [
      {
        commentId: "commentId",
        profileId: "1",
        nick: "user_1",
        avatar: "avatar",
        text: "text",
      },
    ],
  });
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
  const response = await request(app)
    .delete(`/video/${videoId}/comment`)
    .send({ commentId: body.commentId })
    .set({ authorization });
  expect(response.statusCode).toBe(200);
});
