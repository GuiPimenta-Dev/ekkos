import CreateProfile from "../../usecase/profile/CreateProfile";
import Created from "../http/Created";
import FollowProfile from "../../usecase/profile/FollowProfile";
import GetProfile from "../../usecase/profile/GetProfile";
import InputDTO from "../../dto/InputDTO";
import ProfilePresenter from "../presenter/Profile";
import Success from "../http/Success";
import UnfollowProfile from "../../usecase/profile/UnfollowProfile";
import { config } from "../../Config";

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
    const data = ProfilePresenter.get(await controller.execute(path.id));
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
