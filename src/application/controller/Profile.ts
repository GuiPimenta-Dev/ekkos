import InputDTO from "../../dto/InputDTO";
import OutputDTO from "../../dto/OutputDTO";
import CreateProfile from "../../usecase/Profile/CreateProfile";
import { config } from "../../Config";

export default class ProfileController {
  static async createProfile(input: InputDTO): Promise<OutputDTO> {
    const { body, headers } = input;
    const controller = new CreateProfile(config.profileRepository);
    await controller.execute(body.nickname, headers.id);
    return { statusCode: 201, data: null };
  }
}
