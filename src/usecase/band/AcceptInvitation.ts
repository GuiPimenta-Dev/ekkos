import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import BrokerInterface from "../../domain/infra/broker/Broker";
import { Status } from "../../dto/InvitationDTO";
import InviteAcceptedEvent from "../../domain/event/InviteAcceptedEvent";

export default class AcceptInvitation {
  constructor(private bandRepository: BandRepositoryInterface, private broker: BrokerInterface) {}

  async execute(profileId: string, invitationId: string): Promise<void> {
    const invitation = await this.bandRepository.findInvitationById(invitationId);
    const band = await this.bandRepository.findBandById(invitation.bandId);
    band.addMember({ profileId, bandId: invitation.bandId, role: invitation.role });
    await this.bandRepository.update(band);
    await this.bandRepository.updateInvitation({ ...invitation, status: Status.accepted });
    await this.broker.publish(new InviteAcceptedEvent(profileId, band, invitation.role));
  }
}