import Band from "../../../domain/entity/band/Band";
import Invite from "../../../domain/entity/band/Invite";
import RoleDTO from "../../../dto/RoleDTO";

export default interface BandRepositoryInterface {
  create(band: Band): Promise<void>;
  findBandById(id: string): Promise<Band>;
  findBandsByProfileId(profileId: string): Promise<Band[]>;
  findRoles(): Promise<RoleDTO[]>;
  update(band: Band): Promise<void>;
  createInvite(invite: Invite): Promise<void>;
  findInviteById(id: string): Promise<Invite>;
  updateInvite(invite: Invite): Promise<void>;
}
