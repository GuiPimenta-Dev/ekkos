import BadRequest from "../../application/http/BadRequest";
import Profile from "../entity/Profile";

export default class ProfileService {
  static follow(follower: Profile, followee: Profile) {
    if (follower.userId === followee.userId) throw new BadRequest("You can't follow yourself");
    follower.addFollowing(followee.userId);
    followee.addFollower(follower.userId);
  }

  static unfollow(unfollower: Profile, unfollowee: Profile) {
    if (unfollower.userId === unfollowee.userId) throw new BadRequest("You can't unfollow yourself");
    unfollower.removeFollowing(unfollowee.userId);
    unfollowee.removeFollower(unfollower.userId);
  }
}
