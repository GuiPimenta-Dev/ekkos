import MemoryAuthRepository from "../../src/infra/repository/memory/MemoryAuthRepository";
import MemoryProfileRepository from "../../src/infra/repository/memory/MemoryProfileRepository";
import CreateAccount from "../../src/usecase/User/CreateAccount";
import MemoryBroker from "../../src/infra/broker/MemoryBroker";
test("It should be able to create an account", async () => {
  const authRepository = new MemoryAuthRepository();
  const broker = new MemoryBroker();
  const usecase = new CreateAccount(authRepository, broker);
  await usecase.execute("email", "password");
  expect(authRepository.users).toHaveLength(1);
});

test("It should be able to create an account if email is already taken", async () => {
  const authRepository = new MemoryAuthRepository();
  const broker = new MemoryBroker();
  const usecase = new CreateAccount(authRepository, broker);
  await usecase.execute("email", "password");
  await expect(usecase.execute("email", "password")).rejects.toThrow("Email already taken");
});
