import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import Member from "../../domain/entity/Member";
import NotFound from "../../application/http/NotFound";
import Role from "../../domain/entity/Role";

export default class AddMember {
  constructor(private readonly bandRepository: BandRepositoryInterface) {}

  async execute(bandId: string, userId: string, _role: string): Promise<void> {
    const band = await this.bandRepository.findBandById(bandId);
    if (!band) throw new NotFound("Band not found");
    const roles = await this.bandRepository.findRoles();
    const role = roles.find((r) => r.role === _role);
    if (!role) throw new NotFound("Role not found");
    const member = new Member(userId, bandId, new Role(role.role, role.picture));
    band.addMember(userId, member);
    await this.bandRepository.update(band);
  }
}
