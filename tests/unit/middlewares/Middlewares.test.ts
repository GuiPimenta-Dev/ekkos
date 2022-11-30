import {
  verifyBand,
  verifyInvite,
  verifyRole,
  verifyToken,
  verifyUser,
  verifyVideo,
} from "../../../src/application/middleware/Middlewares";

import CreateUser from "../../../src/usecase/user/CreateUser";
import ExpressResponseFake from "../../utils/mocks/http/ExpressResponseFake";
import LoginUser from "../../../src/usecase/user/LoginUser";
import MemoryBroker from "../../../src/infra/broker/MemoryBroker";
import MemoryUserRepository from "../../../src/infra/repository/MemoryUserRepository";
import { config } from "../../../src/Config";

let token: string;
let res: ExpressResponseFake;
const next = jest.fn();
beforeAll(async () => {
  const userRepository = new MemoryUserRepository();
  const broker = new MemoryBroker();
  const createUserUseCase = new CreateUser(userRepository, broker);
  await createUserUseCase.execute("email", "password");
  const usecase = new LoginUser(userRepository);
  token = await usecase.execute("email", "password");
});

beforeEach(() => {
  res = new ExpressResponseFake();
});

test("Must be able to verify token", async () => {
  const req = { headers: { authorization: `Bearer ${token}` } };
  verifyToken(req, res, next);
  expect(req.headers).toHaveProperty("id");
});

test("Must throw an error if there is no authorization header", async () => {
  const req = { headers: {} };
  verifyToken(req, res, next);
  expect(res.statusCode).toBe(400);
  expect(res.message).toBe("Authorization header is required");
});

test("Must throw an error if there is no token in authorization header", async () => {
  const req = { headers: { authorization: "Bearer" } };
  verifyToken(req, res, next);
  expect(res.statusCode).toBe(401);
  expect(res.message).toBe("JWT token is required");
});

test("Must throw an error if token is invalid", async () => {
  const req = { headers: { authorization: "Bearer 12345" } };
  verifyToken(req, res, next);
  expect(res.statusCode).toBe(401);
  expect(res.message).toBe("Invalid token");
});

test("Must throw an error if user is not found", async () => {
  const req = { headers: { id: "id" } };
  await verifyUser(req, res, next);
  expect(res.statusCode).toBe(404);
  expect(res.message).toBe("User not found");
});

test("Must throw an error if profile is not found", async () => {
  await config.userRepository.save({ userId: "id", email: "email", password: "password" });
  const req = { headers: { id: "id" } };
  await verifyUser(req, res, next);
  config.userRepository = new MemoryUserRepository();
  expect(res.statusCode).toBe(404);
  expect(res.message).toBe("Profile not found");
});

test("Must throw an error if video git not found", async () => {
  const req = { params: { id: "id" } };
  await verifyVideo(req, res, next);
  expect(res.statusCode).toBe(404);
  expect(res.message).toBe("Video not found");
});

test("Must throw an error if band is not found", async () => {
  const req = { params: { id: "id" } };
  await verifyBand(req, res, next);
  expect(res.statusCode).toBe(404);
  expect(res.message).toBe("Band not found");
});

test("Must throw an error if invite is not found", async () => {
  const req = { params: { id: "id" } };
  await verifyInvite(req, res, next);
  expect(res.statusCode).toBe(404);
  expect(res.message).toBe("Invite not found");
});

test("Must throw an error if invite is not pending", async () => {
  const req = { params: { id: "3" } };
  await verifyInvite(req, res, next);
  expect(res.statusCode).toBe(400);
  expect(res.message).toBe("Invite is not pending");
});

test("Must throw an error if invite is not for this profile", async () => {
  const req = { params: { id: "2" }, headers: { id: 1 } };
  await verifyInvite(req, res, next);
  expect(res.statusCode).toBe(403);
  expect(res.message).toBe("Invite is not for this profile");
});

test("Must throw an error if role is invalid", async () => {
  const req = { body: { role: "invalid" } };
  await verifyRole(req, res, next);
  expect(res.statusCode).toBe(400);
  expect(res.message).toBe("Role is invalid");
});
