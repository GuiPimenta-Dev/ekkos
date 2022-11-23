import HttpError from "../../application/error/HttpError";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";

export default class FollowProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(followerId: string, followeeId: string) {
    if (followerId === followeeId) throw new HttpError(400, "You can't follow yourself");
    const follower = await this.profileRepository.getProfileById(followerId);
    const followee = await this.profileRepository.getProfileById(followeeId);
    if (!follower || !followee) throw new HttpError(400, "Profile not found");
    follower.following.push(followee.userId);
    followee.followers.push(follower.userId);
    await this.profileRepository.update(follower);
    await this.profileRepository.update(followee);
  }
}
