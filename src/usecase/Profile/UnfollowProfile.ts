import BadRequest from "../../application/http_status/BadRequest";
import NotFound from "../../application/http_status/NotFound";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";

export default class UnfollowProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(unfollowerId: string, unfolloweeId: string) {
    if (unfollowerId === unfolloweeId) throw new BadRequest("You can't unfollow yourself");
    const unfollower = await this.profileRepository.getProfileById(unfollowerId);
    const unfollowee = await this.profileRepository.getProfileById(unfolloweeId);
    if (!unfollower || !unfollowee) throw new NotFound("Profile not found");
    const unfollowerIndex = unfollower.following.indexOf(unfollowee.userId);
    const unfolloweeIndex = unfollowee.followers.indexOf(unfollower.userId);
    unfollower.following.splice(unfollowerIndex, 1);
    unfollowee.followers.splice(unfolloweeIndex, 1);
    await this.profileRepository.update(unfollower);
    await this.profileRepository.update(unfollowee);
  }
}
