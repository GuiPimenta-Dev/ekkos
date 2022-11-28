import User from "../../domain/entity/User";
import UserRepositoryInterface from "../../domain/infra/repository/UserRepository";

export default class MemoryUserRepository implements UserRepositoryInterface {
  readonly users: User[] = [new User("1", "email@test.com", "123456"), new User("2", "user_2@test.com", "123456")];

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
