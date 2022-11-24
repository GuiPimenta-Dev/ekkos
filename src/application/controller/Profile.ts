import { config } from "../../Config";
import InputDTO from "../../dto/InputDTO";
import CreateProfile from "../../usecase/Profile/CreateProfile";
import FollowProfile from "../../usecase/Profile/FollowProfile";
import GetProfile from "../../usecase/Profile/GetProfile";
import UnfollowProfile from "../../usecase/Profile/UnfollowProfile";
import Created from "../http_status/Created";
import Success from "../http_status/Success";

export default class ProfileController {
  static async create(input: InputDTO): Promise<Created> {
    const { body, headers } = input;
    const controller = new CreateProfile(config.profileRepository);
    await controller.execute(headers.id, body.nickname);
    return new Created();
  }

  static async get(input: InputDTO): Promise<Success> {
    const { path } = input;
    const controller = new GetProfile(config.profileRepository, config.videoRepository);
    const data = await controller.execute(path.id);
    return new Success(data);
  }

  static async follow(input: InputDTO): Promise<Success> {
    const { path, headers } = input;
    const controller = new FollowProfile(config.profileRepository);
    await controller.execute(headers.id, path.id);
    return new Success();
  }

  static async unfollow(input: InputDTO): Promise<Success> {
    const { path, headers } = input;
    const controller = new UnfollowProfile(config.profileRepository);
    await controller.execute(headers.id, path.id);
    return new Success();
  }
}
