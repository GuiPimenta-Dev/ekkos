import MemoryBandRepository from "../../src/infra/repository/MemoryBandRepository";
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
    bandRepository: new MemoryBandRepository(),
    broker: new MemoryBroker(),
    storage: new StorageGatewayFake(),
  },
}));

let authorization: string;

const avatar = "tests/utils/files/avatar.jpeg";
const password = "123456";

beforeAll(async () => {
  const email = "user_1@test.com";
  const { body } = await request(app).post("/user/login").send({ email, password });
  authorization = `Bearer ${body.token}`;
});

test("It should be able to create a profile", async () => {
  const email = "email@test2.com";
  await request(app).post("/user/create").send({ email, password });
  const { body } = await request(app).post("/user/login").send({ email, password });
  const response = await request(app)
    .post("/profile")
    .field("email", email)
    .field("password", password)
    .field("nick", "random-nick")
    .attach("avatar", avatar)
    .set({ authorization: `Bearer ${body.token}` });
  expect(response.statusCode).toBe(201);
});

test("It should be able to get a profile", async () => {
  const response = await request(app).get(`/profile/1`).set({ authorization });
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({
    nick: "user_1",
    avatar: "avatar",
    followers: 0,
    following: 0,
    videos: [
      {
        videoId: "videoId",
        title: "title",
        description: "description",
        url: "url",
        likes: 1,
        comments: 1,
      },
    ],
    bands: [{ bandId: "bandId", name: "name", logo: "logo" }],
  });
});

test("It should be able to follow a profile", async () => {
  const response = await request(app).post(`/profile/2/follow`).set({ authorization });
  expect(response.statusCode).toBe(200);
});

test("It should be able to unfollow a profile", async () => {
  await request(app).post(`/profile/2/follow`).set({ authorization });
  const { statusCode } = await request(app).post(`/profile/2/unfollow`).set({ authorization });
  expect(statusCode).toBe(200);
});

test("It should be able to match a profile near 10 km from you", async () => {
  const response = await request(app)
    .post(`/profile/match`)
    .send({ distance: 10 })
    .set({ authorization, latitude: -22.90463, longitude: -43.1053 });
  expect(response.statusCode).toBe(200);
  expect(response.body.matches).toEqual([
    {
      profile: {
        nick: "user_2",
        avatar: "avatar",
        followers: 0,
        following: 0,
        videos: [],
        bands: [{ bandId: "bandId", name: "name", logo: "logo" }],
      },
      distance: 8.1,
    },
  ]);
});
