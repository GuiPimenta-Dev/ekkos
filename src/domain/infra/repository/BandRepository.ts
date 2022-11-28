import Band from "../../entity/Band";
import RoleDTO from "../../../dto/RoleDTO";
import { InvitationDTO } from "../../../dto/InvitationDTO";

export default interface BandRepositoryInterface {
  save(band: Band): Promise<void>;
  findBandById(id: string): Promise<Band>;
  findBandsByProfileId(profileId: string): Promise<Band[]>;
  findRoles(): Promise<RoleDTO[]>;
  update(band: Band): Promise<void>;
  isRoleValid(role: string): Promise<boolean>;
  createInvitation(invitation: InvitationDTO): Promise<void>;
  findInvitationById(id: string): Promise<InvitationDTO>;
}
