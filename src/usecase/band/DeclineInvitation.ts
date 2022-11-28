import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import BrokerInterface from "../../domain/infra/broker/Broker";
import { Status } from "../../dto/InvitationDTO";
import InviteDeclinedEvent from "../../domain/event/InviteDeclinedEvent";

export default class DeclineInvitation {
  constructor(private bandRepository: BandRepositoryInterface, private broker: BrokerInterface) {}

  async execute(profileId: string, invitationId: string): Promise<void> {
    const invitation = await this.bandRepository.findInvitationById(invitationId);
    const band = await this.bandRepository.findBandById(invitation.bandId);
    await this.bandRepository.updateInvitation({ ...invitation, status: Status.declined });
    await this.broker.publish(new InviteDeclinedEvent(profileId, band, invitation.role));
  }
}
