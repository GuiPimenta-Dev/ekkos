import NotFound from "../../application/http/NotFound";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";
import AddMemberDTO from "../../dto/AddMemberDTO";
import { Status } from "../../dto/InvitationDTO";
import { v4 as uuid } from "uuid";
import BrokerInterface from "../../domain/infra/broker/Broker";
import MemberInvitedEvent from "../../domain/event/MemberInvitedEvent";
import Forbidden from "../../application/http/Forbidden";

export default class InviteMember {
  constructor(
    private readonly bandRepository: BandRepositoryInterface,
    private profileRepository: ProfileRepositoryInterface,
    private broker: BrokerInterface
  ) {}

  async execute(input: AddMemberDTO): Promise<string> {
    const band = await this.bandRepository.findBandById(input.bandId);
    band.verifyAdmin(input.adminId);
    const profile = await this.profileRepository.findProfileById(input.profileId);
    if (!profile) throw new NotFound("Profile not found");
    const isRoleValid = await this.bandRepository.isRoleValid(input.role);
    if (!isRoleValid) throw new Forbidden("Role is invalid");
    if (input.adminId === input.profileId) {
      band.addMember({ profileId: input.profileId, bandId: input.bandId, role: input.role });
      await this.bandRepository.update(band);
    } else {
      const invitationId = uuid();
      const invitation = {
        invitationId,
        bandId: input.bandId,
        profileId: input.profileId,
        role: input.role,
        status: Status.pending,
      };
      await this.bandRepository.createInvitation(invitation);
      await this.broker.publish(new MemberInvitedEvent(input.profileId, band.name, input.role));
      return invitationId;
    }
  }
}
