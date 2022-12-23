import NotFound from "../../application/http/NotFound";
import ProfileRepositoryInterface from "../../application/ports/repository/ProfileRepositoryInterface";
import ProfileService from "../../domain/service/ProfileService";

export default class UnfollowProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(unfollowerId: string, unfolloweeId: string) {
    const unfollower = await this.profileRepository.findProfileById(unfollowerId);
    const unfollowee = await this.profileRepository.findProfileById(unfolloweeId);
    if (!unfollowee) throw new NotFound("Profile not found");
    ProfileService.unfollow(unfollower, unfollowee);
    await this.profileRepository.update(unfollower);
    await this.profileRepository.update(unfollowee);
  }
}
