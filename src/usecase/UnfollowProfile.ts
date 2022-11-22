import ProfileRepositoryInterface from "../domain/infra/repository/ProfileRepository";

export default class FollowProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(unfollowerId: string, unfolloweeId: string) {
    const unfollower = await this.profileRepository.getProfile(unfollowerId);
    const unfollowee = await this.profileRepository.getProfile(unfolloweeId);
    this.profileRepository.unfollow(unfollower, unfollowee);
  }
}
