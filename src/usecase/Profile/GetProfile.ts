import Profile from "../../domain/entity/Profile";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";

export default class GetProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(id: string): Promise<Profile> {
    return await this.profileRepository.getProfileById(id);
  }
}
