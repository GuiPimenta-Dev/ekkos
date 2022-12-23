import Profile from "../../domain/entity/profile/Profile";
import ProfileRepositoryInterface from "../../application/ports/repository/ProfileRepositoryInterface";

export default class MemoryProfileRepository implements ProfileRepositoryInterface {
  public profiles: Profile[] = [];

  async create(profile: Profile): Promise<void> {
    this.profiles.push(profile);
  }

  async findProfileById(id: string): Promise<Profile> {
    return this.profiles.find((profile) => profile.id === id);
  }

  async update(profile: Profile): Promise<void> {
    this.profiles = this.profiles.filter((p) => p.id !== profile.id);
    this.profiles.push(profile);
  }

  async isNickTaken(nick: string): Promise<Boolean> {
    const profile = this.profiles.find((profile) => profile.nick === nick);
    return profile !== undefined;
  }

  async getAllProfiles(): Promise<Profile[]> {
    return this.profiles;
  }
}
