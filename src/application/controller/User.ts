import CreateUser from "../../usecase/user/CreateUser";
import Created from "../http/Created";
import InputDTO from "../../dto/InputDTO";
import LoginUser from "../../usecase/user/LoginUser";
import Success from "../http/Success";
import { config } from "../../Config";
import HttpSuccess from "../http/extends/HttpSuccess";

export default class UserController {
  static async create(input: InputDTO): Promise<HttpSuccess> {
    const { body } = input;
    const controller = new CreateUser(config.userRepository, config.broker);
    const userId = await controller.execute(body.email, body.password);
    return new Created({ userId });
  }

  static async login(input: InputDTO): Promise<HttpSuccess> {
    const { body } = input;
    const controller = new LoginUser(config.userRepository);
    const token = await controller.execute(body.email, body.password);
    return new Success({ token });
  }
}
