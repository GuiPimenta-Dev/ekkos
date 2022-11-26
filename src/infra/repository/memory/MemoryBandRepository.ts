import Band from "../../../domain/entity/Band";
import BandRepositoryInterface from "../../../domain/infra/repository/BandRepository";
import Role from "../../../domain/entity/Role";

export default class MemoryBandRepository implements BandRepositoryInterface {
  readonly bands: Band[] = [];
  private roles: Role[] = [
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

  async findRoles(): Promise<Role[]> {
    return this.roles;
  }
}
