import User from "../../../domain/entity/User";
import UserRepositoryInterface from "../../../domain/infra/repository/UserRepository";

export default class MemoryUserRepository implements UserRepositoryInterface {
  readonly users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async getUserById(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new Error("User not found");
    return user;
  }

  async update(user: User): Promise<void> {
    const index = this.users.indexOf(user);
    this.users[index] = user;
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const result = this.users.find((user) => user.email === email);
    return result !== undefined;
  }
}
