import AddMemberDTO from "../../dto/AddMemberDTO";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import Member from "../../domain/entity/Member";
import NotFound from "../../application/http/NotFound";
import Role from "../../domain/entity/Role";
import UserRepositoryInterface from "../../domain/infra/repository/UserRepository";

export default class AddMember {
  constructor(
    private readonly bandRepository: BandRepositoryInterface,
    private userRepository: UserRepositoryInterface
  ) {}

  async execute(input: AddMemberDTO): Promise<void> {
    const band = await this.bandRepository.findBandById(input.bandId);
    if (!band) {
      throw new NotFound("Band not found");
    }
    const user = await this.userRepository.findUserById(input.userId);
    if (!user) {
      throw new NotFound("User not found");
    }
    const roles = await this.bandRepository.findRoles();
    const role = roles.find((r) => r.role === input.role);
    if (!role) {
      throw new NotFound("Role not found");
    }
    const member = new Member(input.userId, input.bandId, new Role(role.role, role.picture));
    band.addMember(input.admin, member);
    await this.bandRepository.update(band);
  }
}
