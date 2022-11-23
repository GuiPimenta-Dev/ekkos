import User from "../../../domain/entity/User";
import UserRepositoryInterface from "../../../domain/infra/repository/UserRepository";

export default class MemoryUserRepository implements UserRepositoryInterface {
  readonly users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.users.find((user) => user.email === email);
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const result = this.users.find((user) => user.email === email);
    return result !== undefined;
  }
}
