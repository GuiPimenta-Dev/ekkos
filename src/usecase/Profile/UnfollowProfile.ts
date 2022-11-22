import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";

export default class FollowProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(unfollowerId: string, unfolloweeId: string) {
    const unfollower = await this.profileRepository.getProfileById(unfollowerId);
    const unfollowee = await this.profileRepository.getProfileById(unfolloweeId);
    const unfollowerIndex = unfollower.following.indexOf(unfollowee);
    const unfolloweeIndex = unfollowee.followers.indexOf(unfollower);
    unfollower.following.splice(unfollowerIndex, 1);
    unfollowee.followers.splice(unfolloweeIndex, 1);
    this.profileRepository.update(unfollower);
    this.profileRepository.update(unfollowee);
  }
}
