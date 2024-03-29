import jwt from "jsonwebtoken";
import BadRequest from "../../application/http/BadRequest";
import UserRepositoryInterface from "../../application/ports/repository/UserRepositoryInterface";

export default class LoginUser {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user || user.password !== password) throw new BadRequest("Invalid username or password");
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "40min",
    });
  }
}
