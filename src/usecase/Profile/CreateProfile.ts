import BadRequest from "../../application/http/BadRequest";
import Profile from "../../domain/entity/Profile";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";
import CreateProfileDTO from "../../dto/CreateProfileDTO";

export default class CreateProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(input: CreateProfileDTO): Promise<void> {
    if (await this.profileRepository.isNickTaken(input.nick)) throw new BadRequest("Nick is already taken");
    const profile = new Profile(input.profileId, input.nick, input.avatar, input.latitude, input.longitude, [], [], []);
    await this.profileRepository.save(profile);
  }
}
