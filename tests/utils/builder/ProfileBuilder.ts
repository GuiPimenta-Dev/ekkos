import Profile from "../../../src/domain/entity/profile/Profile";

export default class ProfileBuilder {
  public profileId: string = "profileId";
  public nick: string = "nick";
  public avatar: string = "avatar";
  public latitude: number = 0;
  public longitude: number = 0;
  public following: string[] = [];
  public followers: string[] = [];

  static createProfile() {
    return new ProfileBuilder();
  }

  withProfileId(profileId: string) {
    this.profileId = profileId;
    return this;
  }

  withNick(nick: string) {
    this.nick = nick;
    return this;
  }

  withCoordinates(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
    return this;
  }

  withFollowing(following: string) {
    this.following.push(following);
    return this;
  }

  withFollowers(followers: string) {
    this.followers.push(followers);
    return this;
  }

  build() {
    return new Profile(
      this.profileId,
      this.nick,
      this.avatar,
      this.latitude,
      this.longitude,
      this.following,
      this.followers,
    );
  }
}
