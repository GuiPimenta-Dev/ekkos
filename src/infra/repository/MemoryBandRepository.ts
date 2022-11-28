import Band from "../../domain/entity/Band";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import { InvitationDTO, Status } from "../../dto/InvitationDTO";
import RoleDTO from "../../dto/RoleDTO";

const member = { profileId: "1", bandId: "bandId", role: "guitarist" };

export default class MemoryBandRepository implements BandRepositoryInterface {
  readonly bands: Band[] = [new Band("bandId", "name", "description", "logo", "1", [member])];

  private roles: RoleDTO[] = [
    { role: "vocalist", picture: "some mic picture" },
    { role: "guitarist", picture: "some guitar picture" },
    { role: "bassist", picture: "some bass picture" },
    { role: "drummer", picture: "some drum picture" },
    { role: "keyboard", picture: "some keyboard picture" },
    { role: "manager", picture: "some manager picture" },
  ];

  private invitations: InvitationDTO[] = [
    { invitationId: "1", bandId: "bandId", profileId: "1", role: "guitarist", status: Status.pending },
    { invitationId: "2", bandId: "bandId", profileId: "1", role: "bassist", status: Status.pending },
  ];

  async save(band: Band): Promise<void> {
    this.bands.push(band);
  }

  async findBandById(id: string): Promise<Band> {
    return this.bands.find((band) => band.bandId === id);
  }

  async update(band: Band): Promise<void> {
    const index = this.bands.indexOf(band);
    this.bands[index] = band;
  }

  async findRoles(): Promise<RoleDTO[]> {
    return this.roles;
  }

  async findBandsByProfileId(profileId: string): Promise<Band[]> {
    return this.bands.filter((band) => band.getMembers().find((member) => member.profileId === profileId));
  }

  async isRoleValid(role: string): Promise<boolean> {
    return this.roles.find((r) => r.role === role) !== undefined;
  }

  async createInvitation(invitation: InvitationDTO): Promise<void> {
    this.invitations.push(invitation);
  }
}
