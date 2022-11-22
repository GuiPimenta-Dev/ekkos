import Profile from "../../domain/entity/Profile";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";

export default class CreateProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(id: string, nickname: string): Promise<void> {
    if (await this.profileRepository.isProfileExistent(id)) throw new Error("Profile already exists");
    const profile = new Profile(id, nickname, [], [], []);
    await this.profileRepository.save(profile);
  }
}
