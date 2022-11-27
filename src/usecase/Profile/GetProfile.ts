import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";
import NotFound from "../../application/http/NotFound";

export default class GetProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(profileId: string): Promise<any> {
    const profile = await this.profileRepository.findProfileById(profileId);
    if (!profile) throw new NotFound("Profile not found");
    return profile;
  }
}
