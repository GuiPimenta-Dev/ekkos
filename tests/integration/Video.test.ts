import MemoryBroker from "../../src/infra/broker/MemoryBroker";
import MemoryProfileRepository from "../../src/infra/repository/MemoryProfileRepository";
import MemoryUserRepository from "../../src/infra/repository/MemoryUserRepository";
import MemoryVideoRepository from "../../src/infra/repository/MemoryVideoRepository";
import StorageGatewayFake from "../utils/mocks/gateway/StorageGatewayFake";
import { config } from "../../src/Config";
import app from "../../src/infra/http/Router";
import request from "supertest";
import RepositoryFactory from "../utils/factory/RepositoryFactory";
import User from "../../src/domain/entity/user/User";

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
let factory: RepositoryFactory;
let user: User;

beforeEach(async () => {
  factory = new RepositoryFactory({
    profileRepository: config.profileRepository,
    userRepository: config.userRepository,
    videoRepository: config.videoRepository,
  });
  user = factory.createUser();
  factory.createProfile(user.id);
  const { body } = await request(app).post("/user/login").send({ email: user.email, password: user.password });
  authorization = `Bearer ${body.token}`;
});

test("It should be able to post a video", async () => {
  const response = await request(app)
    .post("/video")
    .field("title", "title")
    .field("description", "description")
    .attach("video", "tests/utils/files/video.mp4")
    .set({ authorization });

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty("videoId");
});

test("It should be able to get a video", async () => {
  const video = factory.createVideo(user.id);

  const response = await request(app).get(`/video/${video.id}`).set({ authorization });

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({
    videoId: video.id,
    profileId: user.id,
    title: "title",
    description: "description",
    url: "url",
    likes: 0,
    comments: [],
  });
});

test("It should be able to like a video", async () => {
  const video = factory.createVideo(user.id);

  const response = await request(app).post(`/video/${video.id}/like`).set({ authorization });

  expect(response.statusCode).toBe(200);
});

test("It should be able to unlike a video", async () => {
  const video = factory.createVideo(user.id);

  await request(app).post(`/video/${video.id}/like`).set({ authorization });
  const response = await request(app).post(`/video/${video.id}/unlike`).set({ authorization });
  expect(response.statusCode).toBe(200);
});

test("It should be able to comment a video", async () => {
  const video = factory.createVideo(user.id);

  const response = await request(app).post(`/video/${video.id}/comment`).send({ text: "text" }).set({ authorization });
  expect(response.statusCode).toBe(200);
});

test("It should be able to delete a comment in a video", async () => {
  const video = factory.createVideo(user.id);

  const { body } = await request(app).post(`/video/${video.id}/comment`).send({ text: "text" }).set({ authorization });
  const response = await request(app)
    .delete(`/video/${video.id}/comment`)
    .send({ commentId: body.commentId })
    .set({ authorization });
  expect(response.statusCode).toBe(200);
});
