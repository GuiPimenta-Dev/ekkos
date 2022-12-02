import Band from "../../domain/entity/Band";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepositoryInterface";
import { InviteDTO, Status } from "../../dto/InviteDTO";
import MemberDTO from "../../dto/MemberDTO";
import RoleDTO from "../../dto/RoleDTO";

export default class MemoryBandRepository implements BandRepositoryInterface {
  bands: Band[];
  roles: RoleDTO[];
  invites: InviteDTO[];
  members: MemberDTO[];

  constructor() {
    this.bands = [
      new Band(
        "bandId",
        "name",
        "description",
        "logo",
        "1",
        [
          { memberId: "1", profileId: "1", role: "admin" },
          { memberId: "2", profileId: "2", role: "guitarist" },
        ],
        ["keyboard"]
      ),
    ];
    this.roles = [
      { role: "vocalist", picture: "some mic picture" },
      { role: "guitarist", picture: "some guitar picture" },
      { role: "bassist", picture: "some bass picture" },
      { role: "drummer", picture: "some drum picture" },
      { role: "keyboard", picture: "some keyboard picture" },
      { role: "manager", picture: "some manager picture" },
    ];
    this.invites = [
      { inviteId: "1", bandId: "bandId", profileId: "1", role: "guitarist", status: Status.pending },
      { inviteId: "2", bandId: "bandId", profileId: "3", role: "bassist", status: Status.pending },
      { inviteId: "3", bandId: "bandId", profileId: "3", role: "bassist", status: Status.declined },
      { inviteId: "4", bandId: "bandId", profileId: "1", role: "guitarist", status: Status.pending },
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

  async createInvite(invite: InviteDTO): Promise<void> {
    this.invites.push(invite);
  }

  async findInviteById(id: string): Promise<InviteDTO> {
    return this.invites.find((invite) => invite.inviteId === id);
  }

  async updateInvite(invite: InviteDTO): Promise<void> {
    const filteredInvite = this.invites.filter((i) => i.inviteId === invite.inviteId)[0];
    const index = this.invites.indexOf(filteredInvite);
    this.invites[index] = invite;
  }
}
