import CreateProfile from "../../src/domain/usecase/CreateProfile";
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
