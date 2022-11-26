import AddMemberDTO from "../../dto/AddMemberDTO";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import Member from "../../domain/entity/Member";
import NotFound from "../../application/http/NotFound";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";
import Role from "../../domain/entity/Role";

export default class AddMember {
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
    const roles = await this.bandRepository.findRoles();
    const role = roles.find((r) => r.role === input.role);
    if (!role) {
      throw new NotFound("Role not found");
    }
    const member = new Member(input.profileId, input.bandId, new Role(role.role, role.picture));
    band.addMember(input.admin, member);
    await this.bandRepository.update(band);
  }
}
