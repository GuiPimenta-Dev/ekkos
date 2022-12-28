import Band from "../../domain/entity/band/Band";
import BandRepositoryInterface from "../../application/ports/repository/BandRepositoryInterface";
import RoleDTO from "../../dto/RoleDTO";
import Member from "../../domain/entity/band/Member";
import Invite from "../../domain/entity/band/Invite";

export default class MemoryBandRepository implements BandRepositoryInterface {
  bands: Band[];
  roles: RoleDTO[];
  invites: Invite[];
  members: Member[];

  constructor() {
    this.bands = [];
    this.roles = [
      { role: "vocalist", picture: "some mic picture" },
      { role: "guitarist", picture: "some guitar picture" },
      { role: "bassist", picture: "some bass picture" },
      { role: "drummer", picture: "some drum picture" },
      { role: "keyboard", picture: "some keyboard picture" },
      { role: "manager", picture: "some manager picture" },
    ];
    this.invites = [];
  }

  async create(band: Band): Promise<void> {
    this.bands.push(band);
  }

  async findBandById(id: string): Promise<Band> {
    return this.bands.find((band) => band.id === id);
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

  async createInvite(invite: Invite): Promise<void> {
    this.invites.push(invite);
  }

  async findInviteById(id: string): Promise<Invite> {
    return this.invites.find((invite) => invite.id === id);
  }

  async updateInvite(invite: Invite): Promise<void> {
    const filteredInvite = this.invites.find((i) => i.id === invite.id);
    const index = this.invites.indexOf(filteredInvite);
    this.invites[index] = invite;
  }
}
