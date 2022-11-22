import Profile from "../../entity/Profile";

export default interface ProfileRepositoryInterface {
  save(input: Profile): Promise<void>;
  getProfile(id: string): Promise<Profile>;
  follow(follower: Profile, followee: Profile): Promise<void>;
  unfollow(unfollower: Profile, unfollowee: Profile): Promise<void>;
}
