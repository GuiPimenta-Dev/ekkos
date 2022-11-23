import InputDTO from "../../dto/InputDTO";
import OutputDTO from "../../dto/OutputDTO";
import CreateUser from "../../usecase/User/CreateUser";
import MemoryUserRepository from "../../infra/repository/memory/MemoryUserRepository";
import MemoryBroker from "../../infra/broker/MemoryBroker";
import LoginUser from "../../usecase/User/LoginUser";

const userRepository = new MemoryUserRepository();
const broker = new MemoryBroker();

export default class UserController {
  static async createUser(input: InputDTO): Promise<OutputDTO> {
    const { body } = input;
    const controller = new CreateUser(userRepository, broker);
    await controller.execute(body.email, body.password);
    return { statusCode: 201, data: null };
  }

  static async loginUser(input: InputDTO): Promise<OutputDTO> {
    const { body } = input;
    const controller = new LoginUser(userRepository);
    const token = await controller.execute(body.email, body.password);
    return { statusCode: 200, data: { token } };
  }
}
