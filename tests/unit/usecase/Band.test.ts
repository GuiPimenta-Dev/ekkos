import AddMember from "../../../src/usecase/band/AddMember";
import BandRepositoryInterface from "../../../src/domain/infra/repository/BandRepository";
import CreateBand from "../../../src/usecase/band/CreateBand";
import CreateUser from "../../../src/usecase/user/CreateUser";
import MemoryBandRepository from "../../../src/infra/repository/memory/MemoryBandRepository";
import MemoryBroker from "../../../src/infra/broker/MemoryBroker";
import MemoryUserRepository from "../../../src/infra/repository/memory/MemoryUserRepository";
import UserRepositoryInterface from "../../../src/domain/infra/repository/UserRepository";

let bandRepository: BandRepositoryInterface;
let userRepository: UserRepositoryInterface;
let bandId: string;
let userId: string;
beforeEach(async () => {
  bandRepository = new MemoryBandRepository();
  userRepository = new MemoryUserRepository();
  const usecase = new CreateBand(bandRepository);
  bandId = await usecase.execute("admin", "Some cool name for a band", "Some cool picture for a band");
  userId = await new CreateUser(userRepository, new MemoryBroker()).execute("user@gmail.com", "123456");
});

test("It should be able to create a band", async () => {
  const bandRepository = new MemoryBandRepository();
  const usecase = new CreateBand(bandRepository);
  await usecase.execute("id", "Some cool name for a band", "Some cool logo for a band");
  expect(bandRepository.bands).toHaveLength(1);
});

test("It should be able to add a member", async () => {
  const usecase = new AddMember(bandRepository, userRepository);
  const input = { bandId, admin: "admin", userId, role: "guitarist" };
  await usecase.execute(input);
  const band = await bandRepository.findBandById(bandId);
  expect(band.getMembers()).toHaveLength(1);
});

test("It should not be able to add the same member twice", async () => {
  const usecase = new AddMember(bandRepository, userRepository);
  const input = { bandId, admin: "admin", userId, role: "guitarist" };
  await usecase.execute(input);
  expect(usecase.execute(input)).rejects.toThrow("User already in band");
});

test("It should not be able to add a member if you are not the admin", async () => {
  const usecase = new AddMember(bandRepository, userRepository);
  const input = { bandId, admin: "user", userId, role: "guitarist" };
  expect(usecase.execute(input)).rejects.toThrow("Only the admin can perform this action");
});

test("It should not be able to add a member if band does not exists", async () => {
  const usecase = new AddMember(bandRepository, userRepository);
  const input = { bandId: "bandId", admin: "admin", userId, role: "guitarist" };
  expect(usecase.execute(input)).rejects.toThrow("Band not found");
});

test("It should not be able to add a member if member does not exists", async () => {
  const usecase = new AddMember(bandRepository, userRepository);
  const input = { bandId, admin: "admin", userId: "userId", role: "guitarist" };
  expect(usecase.execute(input)).rejects.toThrow("User not found");
});

test("It should not be able to add a member if role does not exists", async () => {
  const usecase = new AddMember(bandRepository, userRepository);
  const input = { bandId, admin: "admin", userId, role: "guitaarist" };
  expect(usecase.execute(input)).rejects.toThrow("Role not found");
});
