import CreateProfile from "../../usecase/profile/CreateProfile";
import Created from "../http/Created";
import FollowProfile from "../../usecase/profile/FollowProfile";
import GetProfile from "../../usecase/profile/GetProfile";
import InputDTO from "../../dto/InputDTO";
import Success from "../http/Success";
import UnfollowProfile from "../../usecase/profile/UnfollowProfile";
import { config } from "../../Config";
import MatchProfiles from "../../usecase/profile/MatchProfiles";
import ProfilePresenter from "../presenter/Profile";

export default class ProfileController {
  static async create(input: InputDTO): Promise<Created> {
    const { body, headers, file } = input;
    const controller = new CreateProfile(config.profileRepository);
    await controller.execute({
      profileId: headers.id,
      nick: body.nick,
      avatar: file.location,
      latitude: headers.latitude,
      longitude: headers.longitude,
    });
    return new Created();
  }

  static async get(input: InputDTO): Promise<Success> {
    const { headers } = input;
    const controller = new GetProfile(config.profileRepository);
    const profile = await controller.execute(headers.id);
    const presenter = new ProfilePresenter(config.videoRepository, config.bandRepository);
    const data = await presenter.present(profile);
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

  static async match(input: InputDTO): Promise<Success> {
    const { body, headers } = input;
    const controller = new MatchProfiles(config.profileRepository);
    const matches = await controller.execute(headers.id, body.distance);
    const presenter = new ProfilePresenter(config.videoRepository, config.bandRepository);
    const presentedMatches = matches.map(async (match) => {
      const profile = await presenter.present(match.profile);
      return { profile, distance: match.distance };
    });
    return new Success({ matches: presentedMatches });
  }
}
