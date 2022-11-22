import CreateProfile from "../../src/usecase/Profile/CreateProfile";
import FollowProfile from "../../src/usecase/Profile/FollowProfile";
import UnfollowProfile from "../../src/usecase/Profile/UnfollowProfile";
import ProfileRepository from "../mocks/repository/ProfileRepository";

test("It should be able to create a profile", async () => {
  const profileRepository = new ProfileRepository();
  const usecase = new CreateProfile(profileRepository);
  await usecase.execute("id", "userId");
  expect(profileRepository.profiles).toHaveLength(1);
});

test("It should not be able to create a profile if it already exists", async () => {
  const profileRepository = new ProfileRepository();
  const usecase = new CreateProfile(profileRepository);
  await usecase.execute("id", "userId");
  await expect(usecase.execute("id", "userId")).rejects.toThrow("Profile already exists");
});

test("It should be able to follow a profile", async () => {
  const profileRepository = new ProfileRepository();
  const createProfileUseCase = new CreateProfile(profileRepository);
  await createProfileUseCase.execute("id", "userId");
  await createProfileUseCase.execute("id2", "userId2");
  const followProfileUseCase = new FollowProfile(profileRepository);
  await followProfileUseCase.execute("id", "id2");
  const follower = await profileRepository.getProfile("id");
  const followee = await profileRepository.getProfile("id2");
  expect(follower.following).toContain(followee);
  expect(followee.followers).toContain(follower);
});

test("It should be able to unfollow a profile", async () => {
  const profileRepository = new ProfileRepository();
  const createProfileUseCase = new CreateProfile(profileRepository);
  await createProfileUseCase.execute("id", "userId");
  await createProfileUseCase.execute("id2", "userId2");
  const followProfileUseCase = new FollowProfile(profileRepository);
  await followProfileUseCase.execute("id", "id2");
  const unfollowProfileUseCase = new UnfollowProfile(profileRepository);
  await unfollowProfileUseCase.execute("id", "id2");
  const follower = await profileRepository.getProfile("id");
  const followee = await profileRepository.getProfile("id2");
  expect(follower.following).toHaveLength(0);
  expect(followee.followers).toHaveLength(0);
});
