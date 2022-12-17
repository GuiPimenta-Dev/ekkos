import MemoryBroker from "../../src/infra/broker/MemoryBroker";
import MemoryProfileRepository from "../../src/infra/repository/MemoryProfileRepository";
import MemoryUserRepository from "../../src/infra/repository/MemoryUserRepository";
import MemoryVideoRepository from "../../src/infra/repository/MemoryVideoRepository";
import StorageGatewayFake from "../utils/mocks/gateway/StorageGatewayFake";
import { config } from "../../src/Config";
import app from "../../src/infra/http/Router";
import request from "supertest";
import RepositoryFactory from "../utils/factory/RepositoryFactory";
import User from "../../src/domain/entity/User";

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
let repositoryFactory: RepositoryFactory;
let user: User;

beforeEach(async () => {
  repositoryFactory = new RepositoryFactory({
    profileRepository: config.profileRepository,
    userRepository: config.userRepository,
    videoRepository: config.videoRepository,
  });
  user = repositoryFactory.createUser();
  repositoryFactory.createProfile(user.userId);
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
  const video = repositoryFactory.createVideo(user.userId);

  const response = await request(app).get(`/video/${video.videoId}`).set({ authorization });

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({
    videoId: video.videoId,
    profileId: user.userId,
    title: 'title',
    description: 'description',
    url: 'url',
    likes: 0,
    comments: []
  });
})

test("It should be able to like a video", async () => {
  const video = repositoryFactory.createVideo(user.userId);

  const response = await request(app).post(`/video/${video.videoId}/like`).set({ authorization });

  expect(response.statusCode).toBe(200);
});

test("It should be able to unlike a video", async () => {
  const video = repositoryFactory.createVideo(user.userId);

  await request(app).post(`/video/${video.videoId}/like`).set({ authorization });
  const response = await request(app).post(`/video/${video.videoId}/unlike`).set({ authorization });
  expect(response.statusCode).toBe(200);
});

test("It should be able to comment a video", async () => {
  const video = repositoryFactory.createVideo(user.userId);

  const response = await request(app)
    .post(`/video/${video.videoId}/comment`)
    .send({ text: "text" })
    .set({ authorization });
  expect(response.statusCode).toBe(200);
});

test("It should be able to delete a comment in a video", async () => {
  const video = repositoryFactory.createVideo(user.userId);

  const { body } = await request(app).post(`/video/${video. videoId}/comment`).send({ text: "text" }).set({ authorization });
  const response = await request(app)
    .delete(`/video/${video.videoId}/comment`)
    .send({ commentId: body.commentId })
    .set({ authorization });
  expect(response.statusCode).toBe(200);
});
