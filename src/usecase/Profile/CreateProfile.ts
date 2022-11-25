import BadRequest from "../../application/http/BadRequest";
import Profile from "../../domain/entity/Profile";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";

export default class CreateProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(id: string, nick: string, avatar: string): Promise<void> {
    if (await this.profileRepository.isNickTaken(nick)) throw new BadRequest("Nick is already taken");
    const profile = new Profile(id, nick, avatar, [], [], []);
    await this.profileRepository.save(profile);
  }
}
