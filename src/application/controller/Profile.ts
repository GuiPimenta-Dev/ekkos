import CreateProfile from "../../usecase/profile/CreateProfile";
import Created from "../http/Created";
import FollowProfile from "../../usecase/profile/FollowProfile";
import InputDTO from "../../dto/InputDTO";
import Success from "../http/Success";
import UnfollowProfile from "../../usecase/profile/UnfollowProfile";
import { config } from "../../Config";
import MatchProfiles from "../../usecase/profile/MatchProfiles";
import ProfilePresenter from "../presenter/Profile";
import HttpSuccess from "../http/extends/HttpSuccess";

export default class ProfileController {
  static async create(input: InputDTO): Promise<HttpSuccess> {
    const { body, headers, file } = input;
    const usecase = new CreateProfile(config.profileRepository);
    await usecase.execute({
      profileId: headers.id,
      nick: body.nick,
      avatar: file.location,
      latitude: headers.latitude,
      longitude: headers.longitude,
    });
    return new Created();
  }

  static async get(input: InputDTO): Promise<HttpSuccess> {
    const { path } = input;
    const presenter = new ProfilePresenter(config.profileRepository, config.videoRepository, config.bandRepository);
    const data = await presenter.present(path.id);
    return new Success(data);
  }

  static async follow(input: InputDTO): Promise<HttpSuccess> {
    const { path, headers } = input;
    const usecase = new FollowProfile(config.profileRepository);
    await usecase.execute(headers.id, path.id);
    return new Success();
  }

  static async unfollow(input: InputDTO): Promise<HttpSuccess> {
    const { path, headers } = input;
    const usecase = new UnfollowProfile(config.profileRepository);
    await usecase.execute(headers.id, path.id);
    return new Success();
  }

  static async match(input: InputDTO): Promise<HttpSuccess> {
    const { body, headers } = input;
    const usecase = new MatchProfiles(config.profileRepository);
    const matches = await usecase.execute(headers.id, body.distance);
    const presenter = new ProfilePresenter(config.profileRepository, config.videoRepository, config.bandRepository);
    const data = await Promise.all(
      matches.map(async (match) => {
        const profile = await presenter.present(match.profile.profileId);
        return { profile, distance: match.distance };
      })
    );
    return new Success({ matches: data });
  }
}
