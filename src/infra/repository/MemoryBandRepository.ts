import Band from "../../domain/entity/Band";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import { InvitationDTO, Status } from "../../dto/InvitationDTO";
import RoleDTO from "../../dto/RoleDTO";

export default class MemoryBandRepository implements BandRepositoryInterface {
  bands: Band[];
  roles: RoleDTO[];
  invitations: InvitationDTO[];

  constructor() {
    const members = [
      { profileId: "1", bandId: "bandId", role: "guitarist" },
      { profileId: "2", bandId: "bandId", role: "manager" },
    ];
    this.bands = [new Band("bandId", "name", "description", "logo", "1", members)];
    this.roles = [
      { role: "vocalist", picture: "some mic picture" },
      { role: "guitarist", picture: "some guitar picture" },
      { role: "bassist", picture: "some bass picture" },
      { role: "drummer", picture: "some drum picture" },
      { role: "keyboard", picture: "some keyboard picture" },
      { role: "manager", picture: "some manager picture" },
    ];
    this.invitations = [
      { invitationId: "1", bandId: "bandId", profileId: "1", role: "guitarist", status: Status.pending },
      { invitationId: "2", bandId: "bandId", profileId: "3", role: "bassist", status: Status.pending },
      { invitationId: "3", bandId: "bandId", profileId: "3", role: "bassist", status: Status.declined },
    ];
  }

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

  async findInvitationById(id: string): Promise<InvitationDTO> {
    return this.invitations.find((invitation) => invitation.invitationId === id);
  }

  async updateInvitation(invitation: InvitationDTO): Promise<void> {
    const filteredInvitation = this.invitations.filter((i) => i.invitationId === invitation.invitationId)[0];
    const index = this.invitations.indexOf(filteredInvitation);
    this.invitations[index] = invitation;
  }
}
