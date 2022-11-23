import Profile from "../../../domain/entity/Profile";
import ProfileRepositoryInterface from "../../../domain/infra/repository/ProfileRepository";

export default class MemoryProfileRepository implements ProfileRepositoryInterface {
  readonly profiles: Profile[] = [];

  async save(input: Profile): Promise<void> {
    this.profiles.push(input);
  }

  async getProfileById(id: string): Promise<Profile> {
    return this.profiles.find((video) => video.id === id);
  }

  async update(profile: Profile): Promise<void> {
    const index = this.profiles.indexOf(profile);
    this.profiles[index] = profile;
  }

  async isNicknameTaken(nickname: string): Promise<Boolean> {
    const profile = this.profiles.find((profile) => profile.nickname === nickname);
    return profile !== undefined;
  }
}
