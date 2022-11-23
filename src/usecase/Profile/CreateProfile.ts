import Profile from "../../domain/entity/Profile";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";
import HttpError from "../../application/error/HttpError";

export default class CreateProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(id: string, nickname: string): Promise<void> {
    if (await this.profileRepository.isNicknameTaken(nickname)) throw new HttpError(400, "Nickname is already taken");
    const profile = new Profile(id, nickname, [], [], []);
    await this.profileRepository.save(profile);
  }
}
