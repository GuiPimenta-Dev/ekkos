import MemoryBandRepository from "../../src/infra/repository/MemoryBandRepository";
import MemoryBroker from "../../src/infra/broker/MemoryBroker";
import MemoryProfileRepository from "../../src/infra/repository/MemoryProfileRepository";
import MemoryUserRepository from "../../src/infra/repository/MemoryUserRepository";
import MemoryVideoRepository from "../../src/infra/repository/MemoryVideoRepository";
import StorageGatewayFake from "../utils/mocks/gateway/StorageGatewayFake";
import app from "../../src/infra/http/Router";
import request from "supertest";

let authorization: string;

const avatar = "tests/utils/files/avatar.jpeg";
const bandId = "bandId";

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

beforeAll(async () => {
  const email = "user_1@test.com";
  const password = "123456";
  const { body } = await request(app).post("/user/login").send({ email, password });
  authorization = `Bearer ${body.token}`;
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

test("It should be able to get a band", async () => {
  const response = await request(app).get(`/band/${bandId}`).set({ authorization });
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({
    bandId: "bandId",
    name: "name",
    logo: "logo",
    description: "description",
    adminId: "1",
    members: [
      {
        profileId: "1",
        nick: "user_1",
        avatar: "avatar",
        role: "guitarist",
      },
      {
        avatar: "avatar",
        nick: "user_2",
        profileId: "2",
        role: "manager",
      },
    ],
    vacancies: [
      {
        role: "keyboard",
        picture: "some keyboard picture",
      },
    ],
  });
});

test("It should be able to invite a member to band", async () => {
  const response = await request(app)
    .post(`/band/${bandId}/invite`)
    .send({ profileId: "2", role: "guitarist" })
    .set({ authorization });
  expect(response.statusCode).toBe(200);
});

test("It should be able to accept an invite to band", async () => {
  const response = await request(app).post(`/band/1/invite/accept`).set({ authorization });
  expect(response.statusCode).toBe(200);
});

test("It should be able to decline an invite to band", async () => {
  const response = await request(app).post(`/band/4/invite/decline`).set({ authorization });
  expect(response.statusCode).toBe(200);
});

test("It should be able to remove a member from a band", async () => {
  const response = await request(app)
    .post(`/band/${bandId}/removeMember`)
    .send({ profileId: 2 })
    .set({ authorization });
  expect(response.statusCode).toBe(200);
});

test("It should be able to open a vacancy in a band", async () => {
  const response = await request(app)
    .post(`/band/${bandId}/openVacancy`)
    .send({ role: "guitarist" })
    .set({ authorization });
  expect(response.statusCode).toBe(200);
});

test("It should be able to list all possible roles for a band", async () => {
  const response = await request(app).get(`/roles`).set({ authorization });
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({
    roles: [
      { role: "vocalist", picture: "some mic picture" },
      { role: "guitarist", picture: "some guitar picture" },
      { role: "bassist", picture: "some bass picture" },
      { role: "drummer", picture: "some drum picture" },
      { role: "keyboard", picture: "some keyboard picture" },
      { role: "manager", picture: "some manager picture" },
    ],
  });
});
