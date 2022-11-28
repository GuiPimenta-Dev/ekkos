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
const bandId = "bandId";

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
    description: "description",
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
  });
});

test("It should be able to add a member to a band", async () => {
  const response = await request(app)
    .post(`/band/${bandId}/addMember`)
    .send({ profileId: "2", role: "guitarist" })
    .set({ authorization });
  expect(response.statusCode).toBe(200);
});

test("It should be able to remove a member from a band", async () => {
  const response = await request(app)
    .post(`/band/${bandId}/removeMember`)
    .send({ profileId: 2 })
    .set({ authorization });
  expect(response.statusCode).toBe(200);
});
