import InputDTO from "../../dto/InputDTO";
import OutputDTO from "../../dto/OutputDTO";
import CreateProfile from "../../usecase/Profile/CreateProfile";
import { config } from "../../Config";
import GetProfile from "../../usecase/Profile/GetProfile";
import FollowProfile from "../../usecase/Profile/FollowProfile";

export default class ProfileController {
  static async create(input: InputDTO): Promise<OutputDTO> {
    const { body, headers } = input;
    const controller = new CreateProfile(config.profileRepository);
    await controller.execute(headers.id, body.nickname);
    return { statusCode: 201 };
  }

  static async get(input: InputDTO): Promise<OutputDTO> {
    const { path } = input;
    const controller = new GetProfile(config.profileRepository);
    const data = await controller.execute(path.id);
    return { statusCode: 200, data };
  }

  static async follow(input: InputDTO): Promise<OutputDTO> {
    const { path, headers } = input;
    const controller = new FollowProfile(config.profileRepository);
    await controller.execute(headers.id, path.id);
    return { statusCode: 200 };
  }
}
