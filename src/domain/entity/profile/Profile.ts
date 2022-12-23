import { v4 as uuid } from "uuid";

export default class Profile {
  constructor(
    readonly id: string,
    readonly nick: string,
    readonly avatar: string,
    public latitude: number,
    public longitude: number,
    private followers: string[],
    private following: string[],
  ) {}

  static create(nick: string, avatar: string, latitude: number, longitude: number) {
    return new Profile(uuid(), nick, avatar, latitude, longitude, [], []);
  }

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
    return this.followers;
  }

  getFollowing() {
    return this.following;
  }
}
