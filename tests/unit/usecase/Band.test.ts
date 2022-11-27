import BandRepositoryInterface from "../../../src/domain/infra/repository/BandRepository";
import ProfileRepositoryInterface from "../../../src/domain/infra/repository/ProfileRepository";
import MemoryBandRepository from "../../utils/mocks/repository/MemoryBandRepository";
import MemoryProfileRepository from "../../utils/mocks/repository/MemoryProfileRepository";
import AddMember from "../../../src/usecase/band/AddMember";
import CreateBand from "../../../src/usecase/band/CreateBand";
import GetBand from "../../../src/usecase/band/GetBand";
import RemoveMember from "../../../src/usecase/band/RemoveMember";
import CreateProfile from "../../../src/usecase/profile/CreateProfile";

let bandRepository: BandRepositoryInterface;
let profileRepository: ProfileRepositoryInterface;
let bandId: string;
const profileId = "profileId";
beforeEach(async () => {
  bandRepository = new MemoryBandRepository();
  profileRepository = new MemoryProfileRepository();
  const usecase = new CreateBand(bandRepository);
  bandId = await usecase.execute({
    name: "name",
    description: "description",
    logo: "logo",
    adminId: profileId,
    role: "guitarist",
  });
  await new CreateProfile(profileRepository).execute(profileId, "nick", "avatar");
});

test("It should be able to create a band", async () => {
  const bandRepository = new MemoryBandRepository();
  const usecase = new CreateBand(bandRepository);
  await usecase.execute({
    name: "name",
    description: "description",
    logo: "logo",
    adminId: "adminId",
    role: "guitarist",
  });
  expect(bandRepository.bands).toHaveLength(1);
});

test("It should not be able to create a band with an invalid role", async () => {
  const bandRepository = new MemoryBandRepository();
  const usecase = new CreateBand(bandRepository);
  expect(
    usecase.execute({ name: "name", description: "description", logo: "logo", adminId: "adminId", role: "wrong_role" })
  ).rejects.toThrow("Role is invalid");
});

test("It should be able to add a member", async () => {
  const band = await bandRepository.findBandById(bandId);
  expect(band.getMembers()).toHaveLength(1);
});

test("It should not be able to add a member if band does not exists", async () => {
  const usecase = new AddMember(bandRepository, profileRepository);
  const input = { bandId: "bandId", adminId: "adminId", profileId, role: "guitarist" };
  expect(usecase.execute(input)).rejects.toThrow("Band not found");
});

test("It should not be able to add a member if member does not exists", async () => {
  const usecase = new AddMember(bandRepository, profileRepository);
  const input = { bandId, adminId: "adminId", profileId: "profile", role: "guitarist" };
  expect(usecase.execute(input)).rejects.toThrow("Profile not found");
});

test("It should not be able to add a member if role does not exists", async () => {
  const usecase = new AddMember(bandRepository, profileRepository);
  const input = { bandId, adminId: "adminId", profileId, role: "guitaarist" };
  expect(usecase.execute(input)).rejects.toThrow("Role is invalid");
});

test("It should be able to get a band", async () => {
  const usecase = new GetBand(bandRepository, profileRepository);
  const band = await usecase.execute(bandId);
  expect(band).toHaveProperty("bandId");
  expect(band.name).toBe("name");
  expect(band.logo).toBe("logo");
  expect(band.description).toBe("description");
  expect(band.adminId).toBe(profileId);
  expect(band.members).toEqual([{ userId: profileId, nick: "nick", avatar: "avatar", role: "guitarist" }]);
});

test("It should not be able to get a non-existent band", async () => {
  const usecase = new GetBand(bandRepository, profileRepository);
  expect(usecase.execute("bandId")).rejects.toThrow("Band not found");
});

test("It should not be able to remove a member if band does not exists", async () => {
  const usecase = new RemoveMember(bandRepository);
  expect(usecase.execute("bandId", "adminId", profileId)).rejects.toThrow("Band not found");
});
