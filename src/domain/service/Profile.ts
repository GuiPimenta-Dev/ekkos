import BadRequest from "../../application/http/BadRequest";
import Profile from "../entity/Profile";

export default class ProfileService {
  static follow(follower: Profile, followee: Profile) {
    if (follower.profileId === followee.profileId) throw new BadRequest("You can't follow yourself");
    follower.addFollowing(followee.profileId);
    followee.addFollower(follower.profileId);
  }

  static unfollow(unfollower: Profile, unfollowee: Profile) {
    if (unfollower.profileId === unfollowee.profileId) throw new BadRequest("You can't unfollow yourself");
    unfollower.removeFollowing(unfollowee.profileId);
    unfollowee.removeFollower(unfollower.profileId);
  }
}
