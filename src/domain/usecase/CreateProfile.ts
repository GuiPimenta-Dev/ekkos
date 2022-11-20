import Profile from "../entity/Profile";
import ProfileRepositoryInterface from "../infra/repository/ProfileRepository";

export default class CreateProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(id: string, userId: string): Promise<void> {
    if (await this.profileRepository.isExistent(id)) throw new Error("Profile already exists");
    const profile = new Profile(id, userId, 0, 0, []);
    await this.profileRepository.save(profile);
  }
}
