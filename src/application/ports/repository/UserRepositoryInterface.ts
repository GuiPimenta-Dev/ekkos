import User from "../../../domain/entity/user/User";

export default interface UserRepositoryInterface {
  create(user: User): Promise<void>;
  findUserByEmail(email: string): Promise<User>;
  findUserById(id: string): Promise<User>;
  isEmailTaken(email: string): Promise<boolean>;
}
