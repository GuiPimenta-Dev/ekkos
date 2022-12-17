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
let repositoryFactory: RepositoryFactory;
let user: User;
beforeEach(async () => {
  repositoryFactory = new RepositoryFactory({
    profileRepository: config.profileRepository,
    userRepository: config.userRepository,
    videoRepository: config.videoRepository,
    feedRepository: config.feedRepository,
  });
  user = repositoryFactory.createUser();
  repositoryFactory.createProfile(user.userId);
  const { body } = await request(app).post("/user/login").send({ email: user.email, password: user.password });
  authorization = `Bearer ${body.token}`;
});

test("It should be able to get a feed", async () => {
  const video = repositoryFactory.createFeed(user.userId);

  const response = await request(app).get("/feed").set({ authorization });

  expect(response.status).toBe(200);
  expect(response.body.feed).toEqual([
    {
      videoId: video.videoId,
      profileId: user.userId,
      title: video.title,
      description: video.description,
      url: video.url,
      likes: 0,
      comments: [],
    },
  ]);
});
