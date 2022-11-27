import Profile from "../../domain/entity/Profile";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";

export default class MemoryProfileRepository implements ProfileRepositoryInterface {
  readonly profiles: Profile[] = [
    new Profile("1", "user_1", "avatar", -22.90045, -43.11867, [], []),
    new Profile("2", "user_2", "avatar", -22.93749, -43.17597, [], []),
    new Profile("3", "user_3", "avatar", -22.8219, -43.03092, [], []),
    new Profile("4", "user_4", "avatar", -22.74962, -42.85574, [], []),
  ];

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
