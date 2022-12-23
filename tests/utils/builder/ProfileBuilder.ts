import { v4 as uuid } from "uuid";
import Profile from "../../../src/domain/entity/profile/Profile";
import ProfileRepositoryInterface from "../../../src/application/ports/repository/ProfileRepositoryInterface";

export default class ProfileBuilder {
  public profileId: string;
  public nick: string;
  public avatar: string;
  public latitude: number;
  public longitude: number;
  public following: string[];
  public followers: string[];
  private cont: number = 1;

  constructor(private profileRepository: ProfileRepositoryInterface) {}

  createProfile() {
    this.profileId = uuid();
    this.avatar = "avatar";
    this.latitude = 0;
    this.longitude = 0;
    this.following = [];
    this.followers = [];
    this.nick = `nick_${this.cont}`;
    this.profileRepository.create(this.profile);
    this.cont++;
    return this;
  }

  withNick(nick: string) {
    this.nick = nick;
    this.profileRepository.update(this.profile);
    return this;
  }

  withCoordinates(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.profileRepository.update(this.profile);
    return this;
  }

  withFollowing(following: string[]) {
    this.following = following;
    this.profileRepository.update(this.profile);
    return this;
  }

  withFollowers(followers: string[]) {
    this.followers = followers;
    this.profileRepository.update(this.profile);
    return this;
  }

  private get profile() {
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
