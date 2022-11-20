import Profile from "../../../src/domain/entity/Profile";
import ProfileRepositoryInterface from "../../../src/domain/infra/repository/ProfileRepository";

export default class ProfileRepository implements ProfileRepositoryInterface {
  readonly profiles: Profile[] = [];

  async save(input: Profile): Promise<void> {
    this.profiles.push(input);
  }

  async getProfile(id: string): Promise<Profile> {
    return this.profiles.find((video) => video.id === id);
  }

  async isExistent(id: string): Promise<Boolean> {
    const profile = this.profiles.find((profile) => profile.id === id);
    return profile !== undefined;
  }
}
