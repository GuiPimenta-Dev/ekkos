import Profile from "../domain/entity/Profile";
import ProfileRepositoryInterface from "../domain/infra/repository/ProfileRepository";

export default class CreateProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(id: string, userId: string): Promise<void> {
    const profile = new Profile(id, userId, [], [], []);
    await this.profileRepository.save(profile);
  }
}
