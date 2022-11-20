import Profile from "../../entity/Profile";

export default interface ProfileRepositoryInterface {
  save(input: Profile): Promise<void>;
  getProfile(id: string): Promise<Profile>;
  isExistent(id: string): Promise<Boolean>;
}
