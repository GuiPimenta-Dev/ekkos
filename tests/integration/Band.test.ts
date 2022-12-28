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
import Invite from "../../src/domain/entity/band/Invite";

let authorization: string;
const avatar = "tests/utils/files/avatar.jpeg";
let user: User;
let A: Builder;

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
  A = new Builder();
  user = A.User.build();
  config.userRepository.create(user);
  config.profileRepository.create(A.Profile.withId(user.id).build());
  const { body } = await request(app).post("/user/login").send({ email: user.email, password: user.password });
  authorization = `Bearer ${body.token}`;
});

beforeEach(() => {
  config.bandRepository = new MemoryBandRepository();
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
  const band = A.Band.build();
  config.bandRepository.create(band);

  const response = await request(app).get(`/band/${band.id}`).set({ authorization });

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({
    bandId: band.id,
    name: band.name,
    logo: band.logo,
    description: band.description,
    members: [],
    vacancies: [],
  });
});

test("It should be able to invite a member to band", async () => {
  const profile = A.Profile.withId("adminId").build();
  const band = A.Band.build();
  config.profileRepository.create(profile);
  config.bandRepository.create(band);

  const response = await request(app)
    .post(`/band/${band.id}/invite`)
    .send({ profileId: profile.id, role: "guitarist" })
    .set({ authorization });

  expect(response.statusCode).toBe(200);
});

test("It should be able to accept an invite to band", async () => {
  const member = A.User.build();
  const band = A.Band.withAdminId(user.id).build();
  const invite = Invite.create(band.id, member.id, "guitarist");
  config.userRepository.create(member);
  config.profileRepository.create(A.Profile.withId(member.id).build());
  config.bandRepository.create(band);
  config.bandRepository.createInvite(invite);
  const { body } = await request(app).post("/user/login").send({ email: member.email, password: member.password });
  const authorization = `Bearer ${body.token}`;

  const response = await request(app).post(`/band/invite/${invite.id}/accept`).set({ authorization });

  expect(response.statusCode).toBe(200);
});

test("It should be able to decline an invite to band", async () => {
  const member = A.User.build();
  const band = A.Band.withAdminId(user.id).build();
  const invite = Invite.create(band.id, member.id, "guitarist");
  config.userRepository.create(member);
  config.profileRepository.create(A.Profile.withId(member.id).build());
  config.bandRepository.create(band);
  config.bandRepository.createInvite(invite);
  const { body } = await request(app).post("/user/login").send({ email: member.email, password: member.password });
  const authorization = `Bearer ${body.token}`;

  const response = await request(app).post(`/band/invite/${invite.id}/decline`).set({ authorization });

  expect(response.statusCode).toBe(200);
});

test("It should be able to remove a member from a band", async () => {
  const member = { id: "memberId", profileId: "profileId", role: "guitarist" };
  const band = A.Band.withAdminId(user.id).withMember(member).build();
  config.bandRepository.create(band);

  const response = await request(app)
    .post(`/band/${band.id}/removeMember`)
    .send({ memberId: member.id })
    .set({ authorization });

  expect(response.statusCode).toBe(200);
});

test("It should be able to open a vacancy in a band", async () => {
  const band = A.Band.withAdminId(user.id).build();
  config.bandRepository.create(band);

  const response = await request(app)
    .post(`/band/${band.id}/openVacancy`)
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
