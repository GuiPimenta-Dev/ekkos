import Profile from "../../../src/domain/entity/Profile";
import ProfileRepositoryInterface from "../../../src/domain/infra/repository/ProfileRepository";

export default class ProfileRepository implements ProfileRepositoryInterface {
  readonly profiles: Profile[] = [];

  async save(input: Profile): Promise<void> {
    if (await this.isExistent(input.id)) throw new Error("Profile already exists");
    this.profiles.push(input);
  }

  async getProfile(id: string): Promise<Profile> {
    const profile = this.profiles.find((video) => video.id === id);
    if (!profile) throw new Error("Profile not found");
    return profile;
  }

  async isExistent(id: string): Promise<Boolean> {
    const profile = this.profiles.find((profile) => profile.id === id);
    return profile !== undefined;
  }

  async follow(follower: Profile, followee: Profile): Promise<void> {
    follower.following.push(followee);
    followee.followers.push(follower);
  }
}
