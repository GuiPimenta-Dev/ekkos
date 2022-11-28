import CreateUser from "../../../src/usecase/user/CreateUser";
import UserCreatedHandler from "../../../src/application/handler/UserCreatedHandler";
import EmailGatewayFake from "../../utils/mocks/gateway/EmailGatewayFake";
import LoginUser from "../../../src/usecase/user/LoginUser";
import MemoryBroker from "../../utils/mocks/broker/MemoryBroker";
import MemoryUserRepository from "../../../src/infra/repository/MemoryUserRepository";
import UserRepositoryInterface from "../../../src/domain/infra/repository/UserRepository";
import jwt from "jsonwebtoken";

let userRepository: UserRepositoryInterface;
const email = "email@test.com";
const password = "123456";

beforeEach(async () => {
  userRepository = new MemoryUserRepository();
});

test("It should be able to create an user", async () => {
  const userRepository = new MemoryUserRepository();
  const broker = new MemoryBroker();
  const usecase = new CreateUser(userRepository, broker);
  await usecase.execute("email2@test.com", password);
  expect(userRepository.users).toHaveLength(3);
});

test("Welcome email should be sent after create an user", async () => {
  const userRepository = new MemoryUserRepository();
  const broker = new MemoryBroker();
  const emailGateway = new EmailGatewayFake();
  const handler = new UserCreatedHandler(emailGateway);
  broker.register(handler);
  const usecase = new CreateUser(userRepository, broker);
  await usecase.execute("email2@test.com", password);
  expect(emailGateway.emails).toHaveLength(1);
});

test("It should not be able to create an user if email is already taken", async () => {
  const usecase = new CreateUser(userRepository, new MemoryBroker());
  await expect(usecase.execute(email, password)).rejects.toThrow("Email already taken");
});

test("It should be able to login", async () => {
  const usecase = new LoginUser(userRepository);
  const token = await usecase.execute(email, "123456");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  expect(decoded.id).toBe("1");
});

test("It should not be able to login if password is wrong", async () => {
  const usecase = new LoginUser(userRepository);
  expect(usecase.execute(email, "wrongPassword")).rejects.toThrow("Invalid username or password");
});

test("It should not be able to login if user does not exists", async () => {
  const usecase = new LoginUser(userRepository);
  expect(usecase.execute("wrongEmail", password)).rejects.toThrow("Invalid username or password");
});
