import Profile from "../../../domain/entity/Profile";
import ProfileRepositoryInterface from "../../../domain/infra/repository/ProfileRepository";

export default class MemoryProfileRepository implements ProfileRepositoryInterface {
  readonly profiles: Profile[] = [];

  async save(input: Profile): Promise<void> {
    this.profiles.push(input);
  }

  async findProfileById(id: string): Promise<Profile> {
    return this.profiles.find((profile) => profile.userId === id);
  }

  async update(profile: Profile): Promise<void> {
    const index = this.profiles.indexOf(profile);
    this.profiles[index] = profile;
  }

  async isNickTaken(nick: string): Promise<Boolean> {
    const profile = this.profiles.find((profile) => profile.nick === nick);
    return profile !== undefined;
  }
}
