import CreateUser from "../../../src/usecase/user/CreateUser";
import LoginUser from "../../../src/usecase/user/LoginUser";
import MemoryBroker from "../../../src/infra/broker/MemoryBroker";
import MemoryUserRepository from "../../../src/infra/repository/MemoryUserRepository";
import UserRepositoryInterface from "../../../src/domain/infra/repository/UserRepositoryInterface";
import jwt from "jsonwebtoken";
import RepositoryFactory from "../../utils/factory/RepositoryFactory";

let userRepository: UserRepositoryInterface;
let factory: RepositoryFactory;
beforeEach(async () => {
  userRepository = new MemoryUserRepository();
  factory = new RepositoryFactory({ userRepository });
});

test("It should be able to create an user", async () => {
  const userRepository = new MemoryUserRepository();
  const broker = new MemoryBroker();

  const usecase = new CreateUser(userRepository, broker);
  await usecase.execute("email@test.com", "123456");

  expect(userRepository.users).toHaveLength(1);
});

test("It should not be able to create an user if email is already taken", async () => {
  const user = factory.createUser();

  const usecase = new CreateUser(userRepository, new MemoryBroker());
  await expect(usecase.execute(user.email, user.password)).rejects.toThrow("Email already taken");
});

test("It should be able to login", async () => {
  const user = factory.createUser();

  const usecase = new LoginUser(userRepository);
  const token = await usecase.execute(user.email, user.password);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  expect(decoded.id).toBeDefined();
});

test("It should not be able to login if password is wrong", async () => {
  const user = factory.createUser();

  const usecase = new LoginUser(userRepository);
  expect(usecase.execute(user.email, "invalid-password")).rejects.toThrow("Invalid username or password");
});

test("It should not be able to login if user does not exists", async () => {
  const user = factory.createUser();

  const usecase = new LoginUser(userRepository);
  expect(usecase.execute("invalid-email", user.password)).rejects.toThrow("Invalid username or password");
});
