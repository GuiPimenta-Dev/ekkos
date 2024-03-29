import Profile from "../../../domain/entity/profile/Profile";

export default interface ProfileRepositoryInterface {
  create(input: Profile): Promise<void>;
  findProfileById(id: string): Promise<Profile>;
  update(profile: Profile): Promise<void>;
  isNickTaken(nick: string): Promise<Boolean>;
  getAllProfiles(): Promise<Profile[]>;
}
