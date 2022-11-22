import Profile from "../../../src/domain/entity/Profile";
import ProfileRepositoryInterface from "../../../src/domain/infra/repository/ProfileRepository";

export default class ProfileRepository implements ProfileRepositoryInterface {
  readonly profiles: Profile[] = [];

  async save(input: Profile): Promise<void> {
    this.profiles.push(input);
  }

  async getProfileById(id: string): Promise<Profile> {
    const profile = this.profiles.find((video) => video.id === id);
    if (!profile) throw new Error("Profile not found");
    return profile;
  }

  async update(profile: Profile): Promise<void> {
    const index = this.profiles.indexOf(profile);
    this.profiles[index] = profile;
  }

  async isProfileExistent(id: string): Promise<Boolean> {
    const profile = this.profiles.find((profile) => profile.id === id);
    return profile !== undefined;
  }
}
