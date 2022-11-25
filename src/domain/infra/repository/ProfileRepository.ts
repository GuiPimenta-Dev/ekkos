import Profile from "../../entity/Profile";

export default interface ProfileRepositoryInterface {
  save(input: Profile): Promise<void>;
  findProfileById(id: string): Promise<Profile>;
  update(profile: Profile): Promise<void>;
  isNicknameTaken(nickname: string): Promise<Boolean>;
}
