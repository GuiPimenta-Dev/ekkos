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
import User from "../../src/domain/entity/user/User";
import { v4 as uuid } from "uuid";
import Builder from "../utils/builder/Builder";

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
let user: User;
let A: Builder;

beforeEach(async () => {
  A = new Builder();
  user = A.User.build();
  config.userRepository.create(user);
  config.profileRepository.create(A.Profile.withId(user.id).build());
  const { body } = await request(app).post("/user/login").send({ email: user.email, password: user.password });
  authorization = `Bearer ${body.token}`;
});

test("It should be able to get a feed", async () => {
  config.videoRepository.create(A.Video.build());
  config.feedRepository.create({ postId: uuid(), profileId: user.id, videoId: "videoId" });

  const response = await request(app).get("/feed").set({ authorization });

  expect(response.status).toBe(200);
  expect(response.body.feed).toEqual([
    {
      videoId: "videoId",
      ownerId: "ownerId",
      title: "title",
      description: "description",
      url: "url",
      likes: 0,
      comments: [],
    },
  ]);
});
