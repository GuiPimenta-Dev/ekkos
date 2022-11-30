import ProfileRepositoryInterface from "../../../src/domain/infra/repository/ProfileRepository";
import MemoryProfileRepository from "../../../src/infra/repository/MemoryProfileRepository";
import CreateProfile from "../../../src/usecase/profile/CreateProfile";
import FollowProfile from "../../../src/usecase/profile/FollowProfile";
import GetProfile from "../../../src/usecase/profile/GetProfile";
import UnfollowProfile from "../../../src/usecase/profile/UnfollowProfile";
import MatchProfiles from "../../../src/usecase/profile/MatchProfiles";

let profileRepository: ProfileRepositoryInterface;
const input = { profileId: "id", nick: "nick", avatar: "avatar", latitude: -22.90463, longitude: -43.1053 };
beforeEach(async () => {
  profileRepository = new MemoryProfileRepository();
  const usecase = new CreateProfile(profileRepository);
  await usecase.execute(input);
  await usecase.execute({
    profileId: "id2",
    nick: "nick2",
    avatar: "avatar",
    latitude: 22.90045,
    longitude: -43.11867,
  });
});

test("It should be able to create a profile", async () => {
  const profileRepository = new MemoryProfileRepository();
  const usecase = new CreateProfile(profileRepository);
  await usecase.execute(input);
  expect(profileRepository.profiles).toHaveLength(5);
});

test("It should not be able to create a profile if it already exists", async () => {
  const usecase = new CreateProfile(profileRepository);
  await expect(usecase.execute(input)).rejects.toThrow("Nick is already taken");
});

test("It should be able to get a profile", async () => {
  const usecase = new GetProfile(profileRepository);
  const profile = await usecase.execute("id");
  expect(profile).toBeDefined();
});

test("It should not be able to get a profile that does not exist", async () => {
  const usecase = new GetProfile(profileRepository);
  await expect(usecase.execute("id3")).rejects.toThrow("Profile not found");
});

test("It should not be able to follow an inexistent id", async () => {
  const usecase = new FollowProfile(profileRepository);
  await expect(usecase.execute("id", "randomId")).rejects.toThrow("Profile not found");
});

test("It should not be able to follow an inexistent id", async () => {
  const usecase = new UnfollowProfile(profileRepository);
  await expect(usecase.execute("id", "randomId")).rejects.toThrow("Profile not found");
});

test("It should be able to match profiles that is near you 3km away", async () => {
  const usecase = new MatchProfiles(profileRepository);
  const profiles = await usecase.execute("id", 3);
  expect(profiles).toHaveLength(1);
});

test("It should not be able to match a profile that is far away from you 0.5km away", async () => {
  const usecase = new MatchProfiles(profileRepository);
  const profiles = await usecase.execute("id", 0.5);
  expect(profiles).toHaveLength(0);
});

test("It should not be able to match profile if id dont exist", async () => {
  const usecase = new MatchProfiles(profileRepository);
  await expect(usecase.execute("id3", 3)).rejects.toThrow("Profile not found");
});

test("It should return distance 0 if profile is the same", async () => {
  await new CreateProfile(profileRepository).execute({
    profileId: "id3",
    nick: "nick3",
    avatar: "avatar",
    latitude: -22.90463,
    longitude: -43.1053,
  });
  const usecase = new MatchProfiles(profileRepository);
  const profiles = await usecase.execute("id", 1);
  expect(profiles[0].distance).toBe(0);
});

test("It should consider distance as 1 if dist is higher than 1 when calculating distance", async () => {
  const mockMath = Object.create(global.Math);
  mockMath.cos = () => 1;
  mockMath.sin = () => 1;
  global.Math = mockMath;
  const usecase = new MatchProfiles(profileRepository);
  const profiles = await usecase.execute("id", 1);
  expect(profiles).toBeDefined();
});
