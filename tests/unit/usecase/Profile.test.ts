import CreateProfile from "../../../src/usecase/profile/CreateProfile";
import FollowProfile from "../../../src/usecase/profile/FollowProfile";
import GetProfile from "../../../src/usecase/profile/GetProfile";
import MemoryProfileRepository from "../../../src/infra/repository/memory/MemoryProfileRepository";
import MemoryVideoRepository from "../../../src/infra/repository/memory/MemoryVideoRepository";
import PostVideo from "../../../src/usecase/video/PostVideo";
import ProfileRepositoryInterface from "../../../src/domain/infra/repository/ProfileRepository";
import UnfollowProfile from "../../../src/usecase/profile/UnfollowProfile";

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
  const memoryRepository = new MemoryVideoRepository();
  await new PostVideo(memoryRepository).execute({
    userId: "id",
    title: "title",
    description: "description",
    url: "url",
  });
  const usecase = new GetProfile(profileRepository, memoryRepository);
  const profile = await usecase.execute("id");
  expect(profile).toBeDefined();
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
