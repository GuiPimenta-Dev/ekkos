import NotFound from "../../application/http/NotFound";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";
import AddMemberDTO from "../../dto/AddMemberDTO";
import { Status } from "../../dto/InvitationDTO";
import { v4 as uuid } from "uuid";
import BrokerInterface from "../../domain/infra/broker/Broker";
import MemberInvitedEvent from "../../domain/event/MemberInvitedEvent";

export default class InviteMember {
  constructor(
    private readonly bandRepository: BandRepositoryInterface,
    private profileRepository: ProfileRepositoryInterface,
    private broker: BrokerInterface
  ) {}

  async execute(input: AddMemberDTO): Promise<void> {
    const band = await this.bandRepository.findBandById(input.bandId);
    if (!band) {
      throw new NotFound("Band not found");
    }
    band.verifyAdmin(input.adminId);
    const profile = await this.profileRepository.findProfileById(input.profileId);
    if (!profile) {
      throw new NotFound("Profile not found");
    }
    const isRoleValid = await this.bandRepository.isRoleValid(input.role);
    if (!isRoleValid) {
      throw new NotFound("Role is invalid");
    }
    const invitation = {
      invitationId: uuid(),
      bandId: input.bandId,
      profileId: input.profileId,
      role: input.role,
      status: Status.pending,
    };
    await this.bandRepository.createInvitation(invitation);
    await this.broker.publish(new MemberInvitedEvent(input.profileId, band.name, input.role));
  }
}
