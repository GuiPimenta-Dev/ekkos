import HttpError from "../../application/error/HttpError";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";

export default class FollowProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(unfollowerId: string, unfolloweeId: string) {
    if (unfollowerId === unfolloweeId) throw new HttpError(400, "You can't unfollow yourself");
    const unfollower = await this.profileRepository.getProfileById(unfollowerId);
    const unfollowee = await this.profileRepository.getProfileById(unfolloweeId);
    if (!unfollower || !unfollowee) throw new HttpError(400, "Profile not found");
    const unfollowerIndex = unfollower.following.indexOf(unfollowee.id);
    const unfolloweeIndex = unfollowee.followers.indexOf(unfollower.id);
    unfollower.following.splice(unfollowerIndex, 1);
    unfollowee.followers.splice(unfolloweeIndex, 1);
    await this.profileRepository.update(unfollower);
    await this.profileRepository.update(unfollowee);
  }
}
