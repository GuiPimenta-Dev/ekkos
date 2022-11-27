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

let profileRepository: ProfileRepositoryInterface;
beforeEach(async () => {
  profileRepository = new MemoryProfileRepository();
  const usecase = new CreateProfile(profileRepository);
  await usecase.execute("id", "userId", "avatar1");
  await usecase.execute("id2", "userId2", "avatar2");
});

test("It should be able to create a profile", async () => {
  const profileRepository = new MemoryProfileRepository();
  const usecase = new CreateProfile(profileRepository);
  await usecase.execute("id", "userId", "avatar");
  expect(profileRepository.profiles).toHaveLength(1);
});

test("It should not be able to create a profile if it already exists", async () => {
  const usecase = new CreateProfile(profileRepository);
  await expect(usecase.execute("id", "userId", "avatar")).rejects.toThrow("Nick is already taken");
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
  expect(profile.avatar).toBe("avatar1");
  expect(profile.videos).toHaveLength(1);
  expect(profile.bands).toHaveLength(1);
  expect(profile.followers).toBe(0);
  expect(profile.following).toBe(0);
});

test("It should be able to follow a profile", async () => {
  const usecase = new FollowProfile(profileRepository);
  await usecase.execute("id", "id2");
  const follower = await profileRepository.findProfileById("id");
  const followee = await profileRepository.findProfileById("id2");
  expect(follower.following).toContain(followee.userId);
  expect(followee.followers).toContain(follower.userId);
});

test("It should not be able to follow yourself", async () => {
  const usecase = new FollowProfile(profileRepository);
  await expect(usecase.execute("id", "id")).rejects.toThrow("You can't follow yourself");
});

test("It should not be able to follow an inexistent id", async () => {
  const usecase = new FollowProfile(profileRepository);
  await expect(usecase.execute("id", "randomId")).rejects.toThrow("Profile not found");
});

test("It should be able to unfollow a profile", async () => {
  const usecase = new FollowProfile(profileRepository);
  await usecase.execute("id", "id2");
  const unfollowProfileUseCase = new UnfollowProfile(profileRepository);
  await unfollowProfileUseCase.execute("id", "id2");
  const follower = await profileRepository.findProfileById("id");
  const followee = await profileRepository.findProfileById("id2");
  expect(follower.following).toHaveLength(0);
  expect(followee.followers).toHaveLength(0);
});

test("It should not be able to follow yourself", async () => {
  const usecase = new UnfollowProfile(profileRepository);
  await expect(usecase.execute("id", "id")).rejects.toThrow("You can't unfollow yourself");
});

test("It should not be able to follow an inexistent id", async () => {
  const usecase = new UnfollowProfile(profileRepository);
  await expect(usecase.execute("id", "randomId")).rejects.toThrow("Profile not found");
});
