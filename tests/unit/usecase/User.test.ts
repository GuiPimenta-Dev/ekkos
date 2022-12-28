import CreateUser from "../../../src/usecase/user/CreateUser";
import LoginUser from "../../../src/usecase/user/LoginUser";
import MemoryBroker from "../../../src/infra/broker/MemoryBroker";
import MemoryUserRepository from "../../../src/infra/repository/MemoryUserRepository";
import jwt from "jsonwebtoken";
import UserRepositoryInterface from "../../../src/application/ports/repository/UserRepositoryInterface";
import Builder from "../../utils/builder/Builder";

let userRepository: UserRepositoryInterface;
let A: Builder;

beforeEach(async () => {
  A = new Builder();
  userRepository = new MemoryUserRepository();
});

test("It should be able to create an user", async () => {
  const userRepository = new MemoryUserRepository();
  const broker = new MemoryBroker();

  const usecase = new CreateUser(userRepository, broker);
  await usecase.execute("email@test.com", "123456");

  expect(userRepository.users).toHaveLength(1);
});

test("It should not be able to create an user if email is already taken", async () => {
  userRepository.create(A.User.build());

  const usecase = new CreateUser(userRepository, new MemoryBroker());
  await expect(usecase.execute("email@test.com", "password")).rejects.toThrow("Email already taken");
});

test("It should be able to login", async () => {
  userRepository.create(A.User.build());

  const usecase = new LoginUser(userRepository);
  const token = await usecase.execute("email@test.com", "password");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  expect(decoded.id).toBeDefined();
});

test("It should not be able to login if password is wrong", async () => {
  userRepository.create(A.User.build());

  const usecase = new LoginUser(userRepository);
  expect(usecase.execute("email@test.com", "invalid-password")).rejects.toThrow("Invalid username or password");
});

test("It should not be able to login if user does not exists", async () => {
  userRepository.create(A.User.build());

  const usecase = new LoginUser(userRepository);
  expect(usecase.execute("invalid-email", "password")).rejects.toThrow("Invalid username or password");
});
