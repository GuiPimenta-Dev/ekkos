import { verifyToken, verifyUser } from "../../../src/application/middleware/Middlewares";
import MemoryBroker from "../../../src/infra/broker/MemoryBroker";
import MemoryUserRepository from "../../../src/infra/repository/memory/MemoryUserRepository";
import CreateUser from "../../../src/usecase/user/CreateUser";
import LoginUser from "../../../src/usecase/user/LoginUser";

let token: string;
beforeAll(async () => {
  const userRepository = new MemoryUserRepository();
  const broker = new MemoryBroker();
  const createUserUseCase = new CreateUser(userRepository, broker);
  await createUserUseCase.execute("email", "password");
  const usecase = new LoginUser(userRepository);
  token = await usecase.execute("email", "password");
});

test("Must be able to verify token", async () => {
  const input = {
    query: {},
    body: {},
    headers: {
      authorization: `Bearer ${token}`,
      auth: {},
    },
    path: {},
    file: {},
  };
  verifyToken(input);
  expect(input.headers).toHaveProperty("id");
});

test("Must throw an error if there is no authorization header", async () => {
  const input = {
    query: {},
    body: {},
    headers: {},
    path: {},
    file: {},
  };
  expect(verifyToken(input)).rejects.toThrow("Authorization header is required");
});

test("Must throw an error if there is no token in authorization header", async () => {
  const input = {
    query: {},
    body: {},
    headers: {
      authorization: "Bearer",
    },
    path: {},
    file: {},
  };
  expect(verifyToken(input)).rejects.toThrow("JWT token is required");
});

test("Must throw an error if token is invalid", async () => {
  const input = {
    query: {},
    body: {},
    headers: {
      authorization: "Bearer 12345",
    },
    path: {},
    file: {},
  };
  expect(verifyToken(input)).rejects.toThrow("Invalid token");
});

test("Must throw an error if user is not found", async () => {
  const input = {
    query: {},
    body: {},
    headers: {
      id: "id",
    },
    path: {},
    file: {},
  };
  expect(verifyUser(input)).rejects.toThrow("User not found");
});
