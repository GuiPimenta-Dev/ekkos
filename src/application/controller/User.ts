import InputDTO from "../../dto/InputDTO";
import OutputDTO from "../../dto/OutputDTO";
import CreateUser from "../../usecase/User/CreateUser";
import LoginUser from "../../usecase/User/LoginUser";
import { config } from "../../Config";

export default class UserController {
  static async create(input: InputDTO): Promise<OutputDTO> {
    const { body } = input;
    const controller = new CreateUser(config.userRepository, config.broker);
    const id = await controller.execute(body.email, body.password);
    return { statusCode: 201, data: { id } };
  }

  static async login(input: InputDTO): Promise<OutputDTO> {
    const { body } = input;
    const controller = new LoginUser(config.userRepository);
    const token = await controller.execute(body.email, body.password);
    return { statusCode: 200, data: { token } };
  }
}
