import NotFound from "../../application/http/NotFound";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepositoryInterface";
import ProfileService from "../../domain/service/ProfileService";

export default class FollowProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(followerId: string, followeeId: string) {
    const follower = await this.profileRepository.findProfileById(followerId);
    const followee = await this.profileRepository.findProfileById(followeeId);
    if (!followee) throw new NotFound("Profile not found");
    ProfileService.follow(follower, followee);
    await this.profileRepository.update(follower);
    await this.profileRepository.update(followee);
  }
}
