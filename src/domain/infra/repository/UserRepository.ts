import User from "../../entity/User";

export default interface UserRepositoryInterface {
  save(user: User): Promise<void>;
  getUserByEmail(email: string): Promise<User>;
  isEmailTaken(email: string): Promise<boolean>;
}
