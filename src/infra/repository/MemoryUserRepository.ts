import User from "../../domain/entity/User";
import UserRepositoryInterface from "../../domain/infra/repository/UserRepositoryInterface";

export default class MemoryUserRepository implements UserRepositoryInterface {
  readonly users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.users.find((user) => user.email === email);
  }

  async findUserById(id: string): Promise<User> {
    return this.users.find((user) => user.userId === id);
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const result = this.users.find((user) => user.email === email);
    return result !== undefined;
  }
}
