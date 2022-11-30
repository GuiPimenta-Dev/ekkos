import Band from "../../entity/Band";
import RoleDTO from "../../../dto/RoleDTO";
import { InviteDTO } from "../../../dto/InviteDTO";

export default interface BandRepositoryInterface {
  save(band: Band): Promise<void>;
  findBandById(id: string): Promise<Band>;
  findBandsByProfileId(profileId: string): Promise<Band[]>;
  findRoles(): Promise<RoleDTO[]>;
  update(band: Band): Promise<void>;
  createInvite(invite: InviteDTO): Promise<void>;
  findInviteById(id: string): Promise<InviteDTO>;
  updateInvite(invite: InviteDTO): Promise<void>;
}
