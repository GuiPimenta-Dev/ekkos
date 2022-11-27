import BadRequest from "../../application/http/BadRequest";
import Profile from "../entity/Profile";

export default class ProfileService {
  static follow(follower: Profile, followee: Profile) {
    if (follower.profileId === followee.profileId) throw new BadRequest("You can't follow yourself");
    if (follower.getFollowing().includes(followee.profileId)) {
      throw new BadRequest("You are already following this profile");
    }
    follower.addFollowing(followee.profileId);
    followee.addFollower(follower.profileId);
  }

  static unfollow(unfollower: Profile, unfollowee: Profile) {
    if (unfollower.profileId === unfollowee.profileId) throw new BadRequest("You can't unfollow yourself");
    if (!unfollower.getFollowing().includes(unfollowee.profileId)) {
      throw new BadRequest("You are not following this profile");
    }
    unfollower.removeFollowing(unfollowee.profileId);
    unfollowee.removeFollower(unfollower.profileId);
  }
}
