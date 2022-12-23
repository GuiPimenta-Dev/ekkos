import BadRequest from "../../application/http/BadRequest";
import Profile from "../entity/profile/Profile";

export default class ProfileService {
  static follow(follower: Profile, followee: Profile) {
    if (follower.id === followee.id) throw new BadRequest("You can't follow yourself");
    const isFollowing = this.isFollowing(follower, followee);
    if (isFollowing) throw new BadRequest("You are already following this profile");
    follower.addFollowing(followee.id);
    followee.addFollower(follower.id);
  }

  static unfollow(unfollower: Profile, unfollowee: Profile) {
    if (unfollower.id === unfollowee.id) throw new BadRequest("You can't unfollow yourself");
    const isFollowing = this.isFollowing(unfollower, unfollowee);
    if (!isFollowing) throw new BadRequest("You are not following this profile");
    unfollower.removeFollowing(unfollowee.id);
    unfollowee.removeFollower(unfollower.id);
  }

  private static isFollowing(follower: Profile, followee: Profile) {
    return follower.getFollowing().includes(followee.id);
  }
}
