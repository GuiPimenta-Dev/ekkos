import { config } from "../../Config";
import InputDTO from "../../dto/InputDTO";
import CreateUser from "../../usecase/user/CreateUser";
import LoginUser from "../../usecase/user/LoginUser";
import Created from "../http/Created";
import Success from "../http/Success";

export default class UserController {
  static async create(input: InputDTO): Promise<Created> {
    const { body } = input;
    const controller = new CreateUser(config.userRepository, config.broker);
    const id = await controller.execute(body.email, body.password);
    return new Created({ id });
  }

  static async login(input: InputDTO): Promise<Success> {
    const { body } = input;
    const controller = new LoginUser(config.userRepository);
    const token = await controller.execute(body.email, body.password);
    return new Success({ token });
  }
}
