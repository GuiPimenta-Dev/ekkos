import User from "../../entity/User";

export default interface UserRepositoryInterface {
  save(user: User): Promise<void>;
  findUserByEmail(email: string): Promise<User>;
  findUserById(id: string): Promise<User>;
  isEmailTaken(email: string): Promise<boolean>;
}
