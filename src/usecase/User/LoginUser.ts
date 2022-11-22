import UserRepositoryInterface from "../../domain/infra/repository/UserRepository";
import jwt from "jsonwebtoken";

export default class LoginUser {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user || user.password !== password) throw new Error("Invalid username or password");
    return jwt.sign({ id: user.id }, "KEY_THAT_WILL_BE_CHANGED_IN_PRODUCTION", {
      expiresIn: "40min",
    });
  }
}
