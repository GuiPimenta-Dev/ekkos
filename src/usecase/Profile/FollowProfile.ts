import BadRequest from "../../application/http_status/BadRequest";
import NotFound from "../../application/http_status/NotFound";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";

export default class FollowProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(followerId: string, followeeId: string) {
    if (followerId === followeeId) throw new BadRequest("You can't follow yourself");
    const follower = await this.profileRepository.getProfileById(followerId);
    const followee = await this.profileRepository.getProfileById(followeeId);
    if (!follower || !followee) throw new NotFound("Profile not found");
    follower.following.push(followee.userId);
    followee.followers.push(follower.userId);
    await this.profileRepository.update(follower);
    await this.profileRepository.update(followee);
  }
}
