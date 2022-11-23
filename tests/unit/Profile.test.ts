import CreateProfile from "../../src/usecase/Profile/CreateProfile";
import FollowProfile from "../../src/usecase/Profile/FollowProfile";
import UnfollowProfile from "../../src/usecase/Profile/UnfollowProfile";
import MemoryProfileRepository from "../../src/infra/repository/memory/MemoryProfileRepository";
import GetProfile from "../../src/usecase/Profile/GetProfile";

test("It should be able to create a profile", async () => {
  const profileRepository = new MemoryProfileRepository();
  const usecase = new CreateProfile(profileRepository);
  await usecase.execute("id", "userId");
  expect(profileRepository.profiles).toHaveLength(1);
});

test("It should not be able to create a profile if it already exists", async () => {
  const profileRepository = new MemoryProfileRepository();
  const usecase = new CreateProfile(profileRepository);
  await usecase.execute("id", "userId");
  await expect(usecase.execute("id", "userId")).rejects.toThrow("Nickname is already taken");
});

test("It should be able to get a profile", async () => {
  const profileRepository = new MemoryProfileRepository();
  const getProfileUseCase = new CreateProfile(profileRepository);
  await getProfileUseCase.execute("id", "userId");
  const usecase = new GetProfile(profileRepository);
  const profile = await usecase.execute("id");
  expect(profile).toBeDefined();
});

test("It should be able to follow a profile", async () => {
  const profileRepository = new MemoryProfileRepository();
  const createProfileUseCase = new CreateProfile(profileRepository);
  await createProfileUseCase.execute("id", "userId");
  await createProfileUseCase.execute("id2", "userId2");
  const usecase = new FollowProfile(profileRepository);
  await usecase.execute("id", "id2");
  const follower = await profileRepository.getProfileById("id");
  const followee = await profileRepository.getProfileById("id2");
  expect(follower.following).toContain(followee);
  expect(followee.followers).toContain(follower);
});

test("It should be able to unfollow a profile", async () => {
  const profileRepository = new MemoryProfileRepository();
  const createProfileUseCase = new CreateProfile(profileRepository);
  await createProfileUseCase.execute("id", "userId");
  await createProfileUseCase.execute("id2", "userId2");
  const usecase = new FollowProfile(profileRepository);
  await usecase.execute("id", "id2");
  const unfollowProfileUseCase = new UnfollowProfile(profileRepository);
  await unfollowProfileUseCase.execute("id", "id2");
  const follower = await profileRepository.getProfileById("id");
  const followee = await profileRepository.getProfileById("id2");
  expect(follower.following).toHaveLength(0);
  expect(followee.followers).toHaveLength(0);
});
