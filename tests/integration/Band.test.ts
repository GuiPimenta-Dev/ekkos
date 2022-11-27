import MemoryBandRepository from "../../src/infra/repository/memory/MemoryBandRepository";
import MemoryBroker from "../../src/infra/broker/MemoryBroker";
import MemoryProfileRepository from "../../src/infra/repository/memory/MemoryProfileRepository";
import MemoryUserRepository from "../../src/infra/repository/memory/MemoryUserRepository";
import MemoryVideoRepository from "../../src/infra/repository/memory/MemoryVideoRepository";
import StorageGatewayFake from "../utils/mocks/StorageGatewayFake";
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
const password = "password";
const avatar = "tests/utils/files/avatar.jpeg";
let bandId: string;
let profileId: string;
let secondProfileId: string;
beforeAll(async () => {
  let email = "email@test.com";
  const { body: userResponse } = await request(app).post("/user/create").send({ email, password });
  profileId = userResponse.userId;
  const response = await request(app).post("/user/login").send({ email, password });
  authorization = `Bearer ${response.body.token}`;
  await request(app)
    .post("/profile")
    .field("email", email)
    .field("password", password)
    .field("nick", "nick")
    .attach("avatar", avatar)
    .set({ authorization });
  const { body } = await request(app)
    .post("/band")
    .field("name", "name")
    .field("role", "guitarist")
    .attach("logo", avatar)
    .set({ authorization });
  bandId = body.bandId;
  email = "random_email@gmail.com";
  const { body: secondBody } = await request(app).post("/user/create").send({ email, password });
  secondProfileId = secondBody.userId;
  const secondUserLogin = await request(app).post("/user/login").send({ email, password });
  const secondUser = `Bearer ${secondUserLogin.body.token}`;
  await request(app)
    .post("/profile")
    .field("email", email)
    .field("password", password)
    .field("nick", "nick2")
    .attach("avatar", avatar)
    .set({ authorization: secondUser });
});

test("It should be able to create a band", async () => {
  const response = await request(app)
    .post("/band")
    .field("name", "name")
    .field("description", "description")
    .field("role", "guitarist")
    .attach("logo", avatar)
    .set({ authorization });
  expect(response.statusCode).toBe(201);
  expect(response.body).toHaveProperty("bandId");
});

test("It should be able to add a member to a band", async () => {
  const response = await request(app)
    .post(`/band/${bandId}/addMember`)
    .send({ profileId: secondProfileId, role: "guitarist" })
    .set({ authorization });
  expect(response.statusCode).toBe(200);
});

test("It should be able to get a band", async () => {
  await request(app).post(`/band/${bandId}/addMember`).send({ profileId, role: "guitarist" }).set({ authorization });
  const response = await request(app).get(`/band/${bandId}`).set({ authorization });
  expect(response.statusCode).toBe(200);
});
