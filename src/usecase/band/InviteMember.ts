import NotFound from "../../application/http/NotFound";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";
import AddMemberDTO from "../../dto/AddMemberDTO";

export default class InviteMember {
  constructor(
    private readonly bandRepository: BandRepositoryInterface,
    private profileRepository: ProfileRepositoryInterface
  ) {}

  async execute(input: AddMemberDTO): Promise<void> {
    const band = await this.bandRepository.findBandById(input.bandId);
    if (!band) {
      throw new NotFound("Band not found");
    }
    const profile = await this.profileRepository.findProfileById(input.profileId);
    if (!profile) {
      throw new NotFound("Profile not found");
    }
    const isRoleValid = await this.bandRepository.isRoleValid(input.role);
    if (!isRoleValid) {
      throw new NotFound("Role is invalid");
    }
    const member = { profileId: input.profileId, bandId: input.bandId, role: input.role };
    band.addMember(input.adminId, member);
    await this.bandRepository.update(band);
  }
}
