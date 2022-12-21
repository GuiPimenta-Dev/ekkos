import ProfileRepositoryInterface from "../../../src/domain/infra/repository/ProfileRepositoryInterface";
import MemoryProfileRepository from "../../../src/infra/repository/MemoryProfileRepository";
import CreateProfile from "../../../src/usecase/profile/CreateProfile";
import FollowProfile from "../../../src/usecase/profile/FollowProfile";
import UnfollowProfile from "../../../src/usecase/profile/UnfollowProfile";
import MatchProfiles from "../../../src/usecase/profile/MatchProfiles";
import ProfileBuilder from "../../utils/builder/ProfileBuilder";

let profileRepository: ProfileRepositoryInterface;
let profileBuilder: ProfileBuilder;

beforeEach(async () => {
  profileRepository = new MemoryProfileRepository();
  profileBuilder = new ProfileBuilder(profileRepository);
});


test("It should be able to create a profile", async () => {
  const profileRepository = new MemoryProfileRepository();

  const usecase = new CreateProfile(profileRepository);
  const input = { profileId: "id", nick: "nick", avatar: "avatar", latitude: 0,  longitude: 0 };
  await usecase.execute(input);

  expect(profileRepository.profiles).toHaveLength(1);
});

test("It should not be able to create a profile if it already exists", async () => {
  const profile = profileBuilder.createProfile();

  const usecase = new CreateProfile(profileRepository);
  const input = { profileId: "profileId", nick: profile.nick, avatar: "avatar", latitude: 0, longitude: 0 };

  await expect(usecase.execute(input)).rejects.toThrow("Nick is already taken");
});

test("It should not be able to follow an inexistent id", async () => {
  const profile = profileBuilder.createProfile();

  const usecase = new FollowProfile(profileRepository);
  await expect(usecase.execute(profile.profileId, "invalid-profile-id")).rejects.toThrow("Profile not found");
});

test("It should not be able to follow an inexistent id", async () => {
  const profile = profileBuilder.createProfile();

  const usecase = new UnfollowProfile(profileRepository);
  await expect(usecase.execute(profile.profileId, "invalid-profile-id")).rejects.toThrow("Profile not found");
});

test("It should be able to match all profiles that is near you 15km away", async () => {
  profileBuilder.createProfile().withLatitudeAndLongitude(-22.90045, -43.11867)
  profileBuilder.createProfile().withLatitudeAndLongitude(-22.93749, -43.17597)
  profileBuilder.createProfile().withLatitudeAndLongitude(-22.8219, -43.03092)
  const profile = profileBuilder.createProfile().withLatitudeAndLongitude(-22.90463, -43.1053);

  const usecase = new MatchProfiles(profileRepository);
  const profiles = await usecase.execute(profile.profileId, 15);

  expect(profiles).toHaveLength(3);
});

test("It should not be able to match a profile that is far away from you 0.5km away", async () => {
  profileBuilder.createProfile().withLatitudeAndLongitude(-22.90045, -43.11867)
  profileBuilder.createProfile().withLatitudeAndLongitude(-22.93749, -43.17597)
  profileBuilder.createProfile().withLatitudeAndLongitude(-22.8219, -43.03092)
  const profile = profileBuilder.createProfile().withLatitudeAndLongitude(-22.90463, -43.1053);

  const usecase = new MatchProfiles(profileRepository);
  const profiles = await usecase.execute(profile.profileId, 0.5);

  expect(profiles).toHaveLength(0);
});

test("It should return distance 0 if profile is in same place", async () => {
  profileBuilder.createProfile().withLatitudeAndLongitude(-22.90463, -43.1053)
  const profile = profileBuilder.createProfile().withLatitudeAndLongitude(-22.90463, -43.1053)

  const usecase = new MatchProfiles(profileRepository);
  const profiles = await usecase.execute(profile.profileId, 1);

  expect(profiles[0].distance).toBe(0);
});

test("It should consider distance as 1 if dist is higher than 1 when calculating distance", async () => {
  const mockMath = Object.create(global.Math);
  mockMath.cos = () => 1;
  mockMath.sin = () => 1;
  global.Math = mockMath;
  const profile = profileBuilder.createProfile().withLatitudeAndLongitude(-22.90463, -43.1053)

  const usecase = new MatchProfiles(profileRepository);
  const profiles = await usecase.execute(profile.profileId, 1);

  expect(profiles).toBeDefined();
});
