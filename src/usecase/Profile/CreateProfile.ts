import BadRequest from "../../application/http/BadRequest";
import Profile from "../../domain/entity/Profile";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";

export default class CreateProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(id: string, nick: string): Promise<void> {
    if (await this.profileRepository.isNickTaken(nick)) throw new BadRequest("nick is already taken");
    const profile = new Profile(id, nick, [], [], []);
    await this.profileRepository.save(profile);
  }
}
