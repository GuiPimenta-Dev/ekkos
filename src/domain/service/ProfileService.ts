import BadRequest from "../../application/http/BadRequest";
import Profile from "../entity/profile/Profile";

export default class ProfileService {
  static follow(follower: Profile, followee: Profile) {
    if (follower.profileId === followee.profileId) throw new BadRequest("You can't follow yourself");
    const isFollowing = this.isFollowing(follower, followee);
    if (isFollowing) throw new BadRequest("You are already following this profile");
    follower.addFollowing(followee.profileId);
    followee.addFollower(follower.profileId);
  }

  static unfollow(unfollower: Profile, unfollowee: Profile) {
    if (unfollower.profileId === unfollowee.profileId) throw new BadRequest("You can't unfollow yourself");
    const isFollowing = this.isFollowing(unfollower, unfollowee);
    if (!isFollowing) throw new BadRequest("You are not following this profile");
    unfollower.removeFollowing(unfollowee.profileId);
    unfollowee.removeFollower(unfollower.profileId);
  }

  private static isFollowing(follower: Profile, followee: Profile) {
    return follower.getFollowing().includes(followee.profileId);
  }
}
