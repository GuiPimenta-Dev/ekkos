import Band from "../../entity/Band";
import Role from "../../entity/Role";

export default interface BandRepositoryInterface {
  save(band: Band): Promise<void>;
  findBandById(id: string): Promise<Band>;
  findRoles(): Promise<Role[]>;
  update(band: Band): Promise<void>;
}
