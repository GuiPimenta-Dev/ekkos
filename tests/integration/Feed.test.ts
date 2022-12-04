import MemoryBandRepository from "../../src/infra/repository/MemoryBandRepository";
import MemoryBroker from "../../src/infra/broker/MemoryBroker";
import MemoryProfileRepository from "../../src/infra/repository/MemoryProfileRepository";
import MemoryUserRepository from "../../src/infra/repository/MemoryUserRepository";
import MemoryVideoRepository from "../../src/infra/repository/MemoryVideoRepository";
import StorageGatewayFake from "../utils/mocks/gateway/StorageGatewayFake";
import MemoryFeedRepository from "../../src/infra/repository/MemoryFeedRepository";
import app from "../../src/infra/http/Router";
import request from "supertest";

let authorization: string;

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

beforeAll(async () => {
  const email = "user_2@test.com";
  const password = "123456";
  const { body } = await request(app).post("/user/login").send({ email, password });
  authorization = `Bearer ${body.token}`;
});

test("It should be able to get a feed", async () => {
  const response = await request(app).get("/feed").set({ authorization });
  expect(response.status).toBe(200);
  expect(response.body.feed).toEqual([
    {
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
    },
  ]);
});
