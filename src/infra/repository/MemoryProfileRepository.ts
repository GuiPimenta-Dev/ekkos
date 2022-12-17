import Profile from "../../domain/entity/Profile";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepositoryInterface";

export default class MemoryProfileRepository implements ProfileRepositoryInterface {
  readonly profiles: Profile[] = [];

  async save(profile: Profile): Promise<void> {
    this.profiles.push(profile);
  }

  async findProfileById(id: string): Promise<Profile> {
    return this.profiles.find((profile) => profile.profileId === id);
  }

  async update(profile: Profile): Promise<void> {
    const index = this.profiles.indexOf(profile);
    this.profiles[index] = profile;
  }

  async isNickTaken(nick: string): Promise<Boolean> {
    const profile = this.profiles.find((profile) => profile.nick === nick);
    return profile !== undefined;
  }

  async getAllProfiles(): Promise<Profile[]> {
    return this.profiles;
  }
}
