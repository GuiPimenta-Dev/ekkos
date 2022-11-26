import AddMember from "../../../src/usecase/band/AddMember";
import BandRepositoryInterface from "../../../src/domain/infra/repository/BandRepository";
import CreateBand from "../../../src/usecase/band/CreateBand";
import CreateProfile from "../../../src/usecase/profile/CreateProfile";
import MemoryBandRepository from "../../../src/infra/repository/memory/MemoryBandRepository";
import MemoryProfileRepository from "../../../src/infra/repository/memory/MemoryProfileRepository";
import ProfileRepositoryInterface from "../../../src/domain/infra/repository/ProfileRepository";

let bandRepository: BandRepositoryInterface;
let profileRepository: ProfileRepositoryInterface;
let bandId: string;
const profileId = "profileId";
beforeEach(async () => {
  bandRepository = new MemoryBandRepository();
  profileRepository = new MemoryProfileRepository();
  const usecase = new CreateBand(bandRepository);
  bandId = await usecase.execute("admin", "Some cool name for a band", "Some cool picture for a band");
  await new CreateProfile(profileRepository).execute(profileId, "nick", "avatar");
});

test("It should be able to create a band", async () => {
  const bandRepository = new MemoryBandRepository();
  const usecase = new CreateBand(bandRepository);
  await usecase.execute("id", "Some cool name for a band", "Some cool logo for a band");
  expect(bandRepository.bands).toHaveLength(1);
});

test("It should be able to add a member", async () => {
  const usecase = new AddMember(bandRepository, profileRepository);
  const input = { bandId, admin: "admin", profileId, role: "guitarist" };
  await usecase.execute(input);
  const band = await bandRepository.findBandById(bandId);
  expect(band.getMembers()).toHaveLength(1);
});

test("It should not be able to add the same member twice", async () => {
  const usecase = new AddMember(bandRepository, profileRepository);
  const input = { bandId, admin: "admin", profileId: profileId, role: "guitarist" };
  await usecase.execute(input);
  expect(usecase.execute(input)).rejects.toThrow("User already in band");
});

test("It should not be able to add a member if you are not the admin", async () => {
  const usecase = new AddMember(bandRepository, profileRepository);
  const input = { bandId, admin: "user", profileId, role: "guitarist" };
  expect(usecase.execute(input)).rejects.toThrow("Only the admin can perform this action");
});

test("It should not be able to add a member if band does not exists", async () => {
  const usecase = new AddMember(bandRepository, profileRepository);
  const input = { bandId: "bandId", admin: "admin", profileId, role: "guitarist" };
  expect(usecase.execute(input)).rejects.toThrow("Band not found");
});

test("It should not be able to add a member if member does not exists", async () => {
  const usecase = new AddMember(bandRepository, profileRepository);
  const input = { bandId, admin: "admin", profileId: "profile", role: "guitarist" };
  expect(usecase.execute(input)).rejects.toThrow("Profile not found");
});

test("It should not be able to add a member if role does not exists", async () => {
  const usecase = new AddMember(bandRepository, profileRepository);
  const input = { bandId, admin: "admin", profileId, role: "guitaarist" };
  expect(usecase.execute(input)).rejects.toThrow("Role not found");
});
