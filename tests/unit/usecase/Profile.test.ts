import ProfileRepositoryInterface from "../../../src/domain/infra/repository/ProfileRepository";
import MemoryBandRepository from "../../utils/mocks/repository/MemoryBandRepository";
import MemoryProfileRepository from "../../utils/mocks/repository/MemoryProfileRepository";
import MemoryVideoRepository from "../../utils/mocks/repository/MemoryVideoRepository";
import CreateBand from "../../../src/usecase/band/CreateBand";
import CreateProfile from "../../../src/usecase/profile/CreateProfile";
import FollowProfile from "../../../src/usecase/profile/FollowProfile";
import GetProfile from "../../../src/usecase/profile/GetProfile";
import UnfollowProfile from "../../../src/usecase/profile/UnfollowProfile";
import PostVideo from "../../../src/usecase/video/PostVideo";
import MatchProfile from "../../../src/usecase/profile/MatchProfile";

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
  expect(profileRepository.profiles).toHaveLength(1);
});

test("It should not be able to create a profile if it already exists", async () => {
  const usecase = new CreateProfile(profileRepository);
  await expect(usecase.execute(input)).rejects.toThrow("Nick is already taken");
});

test("It should be able to get a profile", async () => {
  const videoRepository = new MemoryVideoRepository();
  const bandRepository = new MemoryBandRepository();
  await new PostVideo(videoRepository).execute({
    userId: "id",
    title: "title",
    description: "description",
    url: "url",
  });
  await new CreateBand(bandRepository).execute({
    adminId: "id",
    name: "name",
    description: "description",
    logo: "logo",
    role: "guitarist",
  });
  const usecase = new GetProfile(profileRepository, videoRepository, bandRepository);
  const profile = await usecase.execute("id");
  expect(profile.avatar).toBe("avatar");
  expect(profile.videos).toHaveLength(1);
  expect(profile.bands).toHaveLength(1);
  expect(profile.followers).toBe(0);
  expect(profile.following).toBe(0);
});

test("It should not be able to follow an inexistent id", async () => {
  const usecase = new FollowProfile(profileRepository);
  await expect(usecase.execute("id", "randomId")).rejects.toThrow("Profile not found");
});

test("It should not be able to follow an inexistent id", async () => {
  const usecase = new UnfollowProfile(profileRepository);
  await expect(usecase.execute("id", "randomId")).rejects.toThrow("Profile not found");
});

test("It should be able to match a profile that is near you 10km away", async () => {
  const usecase = new MatchProfile(profileRepository);
  const profiles = await usecase.execute("id", 10);
  expect(profiles).toHaveLength(1);
});

test("It should not be able to match a profile that is far away from you 5km away", async () => {
  const usecase = new MatchProfile(profileRepository);
  const profiles = await usecase.execute("id", 5);
  expect(profiles).toHaveLength(0);
});
