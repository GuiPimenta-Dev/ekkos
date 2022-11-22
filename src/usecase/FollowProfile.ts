import Profile from "../domain/entity/Profile";
import ProfileRepositoryInterface from "../domain/infra/repository/ProfileRepository";

export default class FollowProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(followerId: string, followeeId: string) {
    const follower = await this.profileRepository.getProfile(followerId);
    const followee = await this.profileRepository.getProfile(followeeId);
    this.profileRepository.follow(follower, followee);
  }
}
