import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";

export default class FollowProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(followerId: string, followeeId: string) {
    const follower = await this.profileRepository.getProfileById(followerId);
    const followee = await this.profileRepository.getProfileById(followeeId);
    follower.following.push(followee);
    followee.followers.push(follower);
    this.profileRepository.update(follower);
    this.profileRepository.update(followee);
  }
}
