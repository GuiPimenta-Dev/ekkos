import BadRequest from "../../application/http/BadRequest";
import Video from "./Video";

export default class Profile {
  constructor(
    readonly userId: string,
    readonly nick: string,
    readonly avatar: string,
    private followers: string[],
    private following: string[],
    readonly videos: Video[]
  ) {}

  addFollower(profileId: string) {
    this.followers.push(profileId);
  }

  addFollowing(profileId: string) {
    this.following.push(profileId);
  }

  removeFollowing(profileId: string) {
    this.following = this.following.filter((id) => id !== profileId);
  }

  removeFollower(profileId: string) {
    this.followers = this.followers.filter((id) => id !== profileId);
  }

  getFollowers() {
    return this.followers.length;
  }

  getFollowing() {
    return this.following.length;
  }
}
