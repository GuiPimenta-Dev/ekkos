import jwt from "jsonwebtoken";
import CreateUserHandler from "../../../src/application/handler/CreateUserHandler";
import UserRepositoryInterface from "../../../src/domain/infra/repository/UserRepository";
import MemoryBroker from "../../../src/infra/broker/MemoryBroker";
import MemoryUserRepository from "../../../src/infra/repository/memory/MemoryUserRepository";
import CreateUser from "../../../src/usecase/user/CreateUser";
import LoginUser from "../../../src/usecase/user/LoginUser";
import EmailGatewayFake from "../../utils/mocks/EmailGatewayFake";

let userRepository: UserRepositoryInterface;
let createUserUseCase: CreateUser;
let userId;
beforeEach(async () => {
  userRepository = new MemoryUserRepository();
  const broker = new MemoryBroker();
  createUserUseCase = new CreateUser(userRepository, broker);
  userId = await createUserUseCase.execute("email", "password");
});

test("It should be able to create an user", async () => {
  const userRepository = new MemoryUserRepository();
  const broker = new MemoryBroker();
  const usecase = new CreateUser(userRepository, broker);
  await usecase.execute("email", "password");
  expect(userRepository.users).toHaveLength(1);
});

test("Welcome email should be sent after create an user", async () => {
  const userRepository = new MemoryUserRepository();
  const broker = new MemoryBroker();
  const emailGateway = new EmailGatewayFake();
  const handler = new CreateUserHandler(emailGateway);
  broker.register(handler);
  const usecase = new CreateUser(userRepository, broker);
  await usecase.execute("email", "password");
  expect(emailGateway.emailSent).toEqual({ to: "email", subject: "Welcome to our app!", body: "Welcome to our app!" });
});

test("It should not be able to create an user if email is already taken", async () => {
  await expect(createUserUseCase.execute("email", "password")).rejects.toThrow("Email already taken");
});

test("It should be able to login", async () => {
  const usecase = new LoginUser(userRepository);
  const token = await usecase.execute("email", "password");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  expect(decoded.id).toBe(userId);
});

test("It should not be able to login if password is wrong", async () => {
  const usecase = new LoginUser(userRepository);
  expect(usecase.execute("email", "wrongPassword")).rejects.toThrow("Invalid username or password");
});

test("It should not be able to login if user does not exists", async () => {
  const usecase = new LoginUser(userRepository);
  expect(usecase.execute("wrongEmail", "password")).rejects.toThrow("Invalid username or password");
});
