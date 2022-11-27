import Band from "../../domain/entity/Band";
import Member from "../../domain/entity/Member";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import RoleDTO from "../../dto/RoleDTO";

export default class MemoryBandRepository implements BandRepositoryInterface {
  readonly bands: Band[] = [
    new Band("bandId", "name", "description", "logo", "1", [new Member("1", "bandId", "guitarist")]),
  ];

  private roles: RoleDTO[] = [
    { role: "vocalist", picture: "some mic picture" },
    { role: "guitarist", picture: "some guitar picture" },
    { role: "bassist", picture: "some bass picture" },
    { role: "drummer", picture: "some drum picture" },
    { role: "keyboard", picture: "some keyboard picture" },
    { role: "manager", picture: "some manager picture" },
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
}
