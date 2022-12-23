import MemoryBandRepository from "../../src/infra/repository/MemoryBandRepository";
import MemoryBroker from "../../src/infra/broker/MemoryBroker";
import MemoryProfileRepository from "../../src/infra/repository/MemoryProfileRepository";
import MemoryUserRepository from "../../src/infra/repository/MemoryUserRepository";
import MemoryVideoRepository from "../../src/infra/repository/MemoryVideoRepository";
import StorageGatewayFake from "../utils/mocks/gateway/StorageGatewayFake";
import MemoryFeedRepository from "../../src/infra/repository/MemoryFeedRepository";
import { config } from "../../src/Config";
import app from "../../src/infra/http/Router";
import request from "supertest";
import RepositoryFactory from "../utils/factory/RepositoryFactory";
import User from "../../src/domain/entity/User";
import { v4 as uuid } from "uuid";

jest.mock("../../src/Config", () => ({
  ...(jest.requireActual("../../src/Config") as {}),
  config: {
    profileRepository: new MemoryProfileRepository(),
    userRepository: new MemoryUserRepository(),
    videoRepository: new MemoryVideoRepository(),
    bandRepository: new MemoryBandRepository(),
    feedRepository: new MemoryFeedRepository(),
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
  const { body } = await request(app).post("/user/login").send({ email: user.email, password: user.password });
  authorization = `Bearer ${body.token}`;
});

test("It should be able to get a feed", async () => {
  const video = factory.createVideo(user.userId);
  const feed = { postId: uuid(), profileId: user.userId, videoId: video.videoId };
  config.feedRepository.create(feed);

  const response = await request(app).get("/feed").set({ authorization });

  expect(response.status).toBe(200);
  expect(response.body.feed).toEqual([
    {
      videoId: video.videoId,
      profileId: user.userId,
      title: "title",
      description: "description",
      url: "url",
      likes: 0,
      comments: [],
    },
  ]);
});
