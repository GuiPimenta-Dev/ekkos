import BadRequest from "../../application/http/BadRequest";
import Profile from "../../domain/entity/profile/Profile";
import ProfileRepositoryInterface from "../../application/ports/repository/ProfileRepositoryInterface";
import CreateProfileDTO from "../../dto/CreateProfileDTO";

export default class CreateProfile {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async execute(input: CreateProfileDTO): Promise<void> {
    if (await this.profileRepository.isNickTaken(input.nick)) throw new BadRequest("Nick is already taken");
    const profile = Profile.create(input.nick, input.avatar, input.latitude, input.longitude);
    await this.profileRepository.create(profile);
  }
}
