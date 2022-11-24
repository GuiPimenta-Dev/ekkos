import ProfileRepositoryInterface from "../../../src/domain/infra/repository/ProfileRepository";
import MemoryProfileRepository from "../../../src/infra/repository/memory/MemoryProfileRepository";
import MemoryVideoRepository from "../../../src/infra/repository/memory/MemoryVideoRepository";
import CreateProfile from "../../../src/usecase/profile/CreateProfile";
import FollowProfile from "../../../src/usecase/profile/FollowProfile";
import GetProfile from "../../../src/usecase/profile/GetProfile";
import UnfollowProfile from "../../../src/usecase/profile/UnfollowProfile";

let profileRepository: ProfileRepositoryInterface;
beforeEach(async () => {
  profileRepository = new MemoryProfileRepository();
  const usecase = new CreateProfile(profileRepository);
  await usecase.execute("id", "userId");
  await usecase.execute("id2", "userId2");
});

test("It should be able to create a profile", async () => {
  const profileRepository = new MemoryProfileRepository();
  const usecase = new CreateProfile(profileRepository);
  await usecase.execute("id", "userId");
  expect(profileRepository.profiles).toHaveLength(1);
});

test("It should not be able to create a profile if it already exists", async () => {
  const usecase = new CreateProfile(profileRepository);
  await expect(usecase.execute("id", "userId")).rejects.toThrow("Nickname is already taken");
});

test("It should be able to get a profile", async () => {
  const usecase = new GetProfile(profileRepository, new MemoryVideoRepository());
  const profile = await usecase.execute("id");
  expect(profile).toBeDefined();
});

test("It should be able to follow a profile", async () => {
  const usecase = new FollowProfile(profileRepository);
  await usecase.execute("id", "id2");
  const follower = await profileRepository.getProfileById("id");
  const followee = await profileRepository.getProfileById("id2");
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
  const follower = await profileRepository.getProfileById("id");
  const followee = await profileRepository.getProfileById("id2");
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
