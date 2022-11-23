import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";

export default class FollowProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(followerId: string, followeeId: string) {
    const follower = await this.profileRepository.getProfileById(followerId);
    const followee = await this.profileRepository.getProfileById(followeeId);
    follower.following.push(followee.id);
    followee.followers.push(follower.id);
    await this.profileRepository.update(follower);
    await this.profileRepository.update(followee);
  }
}
