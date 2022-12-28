import MemoryBandRepository from "../../src/infra/repository/MemoryBandRepository";
import MemoryBroker from "../../src/infra/broker/MemoryBroker";
import MemoryProfileRepository from "../../src/infra/repository/MemoryProfileRepository";
import MemoryUserRepository from "../../src/infra/repository/MemoryUserRepository";
import MemoryVideoRepository from "../../src/infra/repository/MemoryVideoRepository";
import StorageGatewayFake from "../utils/mocks/gateway/StorageGatewayFake";
import { config } from "../../src/Config";
import app from "../../src/infra/http/Router";
import request from "supertest";
import User from "../../src/domain/entity/user/User";
import Builder from "../utils/builder/Builder";

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
let user: User;
let A: Builder;

const avatar = "tests/utils/files/avatar.jpeg";

beforeEach(async () => {
  A = new Builder();
  user = A.User.build();
  config.userRepository.create(user);
  config.profileRepository.create(A.Profile.withId(user.id).build());
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
  const profile = A.Profile.build();
  config.profileRepository.create(profile);

  const response = await request(app).get(`/profile/${profile.id}`).set({ authorization });

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
  const profile = A.Profile.withId("some-profile-id").build();
  config.profileRepository.create(profile);

  const response = await request(app).post(`/profile/${profile.id}/follow`).set({ authorization });

  expect(response.statusCode).toBe(200);
});

test("It should be able to unfollow a profile", async () => {
  const profile = A.Profile.withId("some-profile-id").build();
  config.profileRepository.create(profile);
  await request(app).post(`/profile/${profile.id}/follow`).set({ authorization });

  const response = await request(app).post(`/profile/${profile.id}/unfollow`).set({ authorization });

  expect(response.statusCode).toBe(200);
});

test("It should be able to match profiles", async () => {
  const response = await request(app)
    .post(`/profile/match`)
    .send({ distance: 10 })
    .set({ authorization, latitude: 0, longitude: 0 });

  expect(response.statusCode).toBe(200);
  expect(response.body.matches).toBeDefined();
});
