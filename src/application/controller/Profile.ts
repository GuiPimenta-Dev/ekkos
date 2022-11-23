import InputDTO from "../../dto/InputDTO";
import OutputDTO from "../../dto/OutputDTO";
import CreateProfile from "../../usecase/Profile/CreateProfile";
import { config } from "../../Config";
import GetProfile from "../../usecase/Profile/GetProfile";

export default class ProfileController {
  static async createProfile(input: InputDTO): Promise<OutputDTO> {
    const { body, headers } = input;
    const controller = new CreateProfile(config.profileRepository);
    await controller.execute(headers.id, body.nickname);
    return { statusCode: 201 };
  }

  static async getProfile(input: InputDTO): Promise<OutputDTO> {
    const { path } = input;
    const controller = new GetProfile(config.profileRepository);
    const data = await controller.execute(path.id);
    return { statusCode: 200, data };
  }
}
