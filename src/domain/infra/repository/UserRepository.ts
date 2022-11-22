import User from "../../entity/User";

export default interface UserRepositoryInterface {
  save(user: User): Promise<void>;
  getUserByEmail(email: string): Promise<User>;
  update(user: User): Promise<void>;
  isEmailTaken(email: string): Promise<boolean>;
}
