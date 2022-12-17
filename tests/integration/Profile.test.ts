import MemoryBandRepository from "../../src/infra/repository/MemoryBandRepository";
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
    bandRepository: new MemoryBandRepository(),
    broker: new MemoryBroker(),
    storage: new StorageGatewayFake(),
  },
}));

let authorization: string;
let repositoryFactory: RepositoryFactory;
let user: User;

const avatar = "tests/utils/files/avatar.jpeg";

beforeEach(async () => {
  repositoryFactory = new RepositoryFactory({
    profileRepository: config.profileRepository,
    userRepository: config.userRepository,
    videoRepository: config.videoRepository,
    bandRepository: config.bandRepository,
  });
  user = repositoryFactory.createUser();
  repositoryFactory.createProfile(user.userId);
  const { body } = await request(app).post("/user/login").send({ email: user.email, password: user.password });
  authorization = `Bearer ${body.token}`;
});

test("It should be able to create a profile", async () => {
  const { body } = await request(app).post("/user/login").send({ email: user.email, password: user.password });

  const response = await request(app)
    .post("/profile")
    .field("email", user.email)
    .field("password", user.password)
    .field("nick", "random-nick")
    .attach("avatar", avatar)
    .set({ authorization: `Bearer ${body.token}` });

  expect(response.statusCode).toBe(201);
});

test("It should be able to get a profile", async () => {
  const profile = repositoryFactory.createProfile();

  const response = await request(app).get(`/profile/${profile.profileId}`).set({ authorization });

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({
    nick: profile.nick,
    avatar: profile.avatar,
    followers: 0,
    following: 0,
    videos: [],
    bands: [],
  });
});

test("It should be able to follow a profile", async () => {
  const profile = repositoryFactory.createProfile();

  const response = await request(app).post(`/profile/${profile.profileId}/follow`).set({ authorization });

  expect(response.statusCode).toBe(200);
});

test("It should be able to unfollow a profile", async () => {
  const profile = repositoryFactory.createProfile();
  await request(app).post(`/profile/${profile.profileId}/follow`).set({ authorization });

  const { statusCode } = await request(app).post(`/profile/${profile.profileId}/unfollow`).set({ authorization });

  expect(statusCode).toBe(200);
});

test("It should be able to match profiles", async () => {
  const response = await request(app)
    .post(`/profile/match`)
    .send({ distance: 10 })
    .set({ authorization, latitude: 0, longitude: 0 });

  expect(response.statusCode).toBe(200);
  expect(response.body.matches).toBeDefined();
});
