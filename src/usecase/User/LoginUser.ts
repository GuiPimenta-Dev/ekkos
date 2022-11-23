import UserRepositoryInterface from "../../domain/infra/repository/UserRepository";
import jwt from "jsonwebtoken";

export default class LoginUser {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user || user.password !== password) throw new Error("Invalid username or password");
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "40min",
    });
  }
}
