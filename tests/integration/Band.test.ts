import MemoryBandRepository from "../../src/infra/repository/MemoryBandRepository";
import MemoryBroker from "../../src/infra/broker/MemoryBroker";
import MemoryProfileRepository from "../../src/infra/repository/MemoryProfileRepository";
import MemoryUserRepository from "../../src/infra/repository/MemoryUserRepository";
import MemoryVideoRepository from "../../src/infra/repository/MemoryVideoRepository";
import StorageGatewayFake from "../utils/mocks/gateway/StorageGatewayFake";
import RepositoryFactory from "../utils/factory/RepositoryFactory";
import { config } from "../../src/Config";
import { v4 as uuid } from "uuid";
import app from "../../src/infra/http/Router";
import request from "supertest";
import User from "../../src/domain/entity/user/User";
import BandBuilder from "../utils/builder/BandBuilder";

let authorization: string;

const avatar = "tests/utils/files/avatar.jpeg";
let factory: RepositoryFactory;
let builder: BandBuilder;
let user: User;
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
  factory = new RepositoryFactory({
    profileRepository: config.profileRepository,
    userRepository: config.userRepository,
  });
  builder = new BandBuilder(config.bandRepository);
  user = factory.createUser();
  const { body } = await request(app).post("/user/login").send({ email: user.email, password: user.password });
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
  const band = builder.createBand(user.id);
  const member = band.members[0];
  const profile = await config.profileRepository.findProfileById(user.id);

  const response = await request(app).get(`/band/${band.bandId}`).set({ authorization });

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({
    bandId: band.bandId,
    name: band.name,
    logo: band.logo,
    description: band.description,
    members: [
      {
        memberId: member.memberId,
        profileId: profile.id,
        role: "admin",
        avatar: profile.avatar,
        nick: profile.nick,
      },
    ],
    vacancies: [],
  });
});

test("It should be able to invite a member to band", async () => {
  const band = builder.createBand(user.id);
  const profile = factory.createProfile();

  const response = await request(app)
    .post(`/band/${band.bandId}/invite`)
    .send({ profileId: profile.id, role: "guitarist" })
    .set({ authorization });

  expect(response.statusCode).toBe(200);
});

test("It should be able to accept an invite to band", async () => {
  const member = factory.createUser();
  const band = builder.createBand(user.id).withInviteTo(member.id);
  const { body } = await request(app).post("/user/login").send({ email: member.email, password: member.password });
  const authorization = `Bearer ${body.token}`;

  const response = await request(app).post(`/band/invite/${band.invite.inviteId}/accept`).set({ authorization });

  expect(response.statusCode).toBe(200);
});

test("It should be able to decline an invite to band", async () => {
  const member = factory.createUser();
  const band = builder.createBand(user.id).withInviteTo(member.id);
  const { body } = await request(app).post("/user/login").send({ email: member.email, password: member.password });
  const authorization = `Bearer ${body.token}`;

  const response = await request(app).post(`/band/invite/${band.invite.inviteId}/decline`).set({ authorization });

  expect(response.statusCode).toBe(200);
});

test("It should be able to remove a member from a band", async () => {
  const member = { memberId: uuid(), profileId: uuid(), role: "guitarist" };
  const band = builder.createBand(user.id).withMember(member);

  const response = await request(app)
    .post(`/band/${band.bandId}/removeMember`)
    .send({ memberId: member.memberId })
    .set({ authorization });

  expect(response.statusCode).toBe(200);
});

test("It should be able to open a vacancy in a band", async () => {
  const band = builder.createBand(user.id);

  const response = await request(app)
    .post(`/band/${band.bandId}/openVacancy`)
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
