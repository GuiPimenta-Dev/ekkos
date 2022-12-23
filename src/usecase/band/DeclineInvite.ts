import BandRepositoryInterface from "../../application/ports/repository/BandRepositoryInterface";
import BrokerInterface from "../../application/ports/broker/BrokerInterface";
import EventFactory from "../../domain/event/EventFactory";

export default class DeclineInvite {
  constructor(private bandRepository: BandRepositoryInterface, private broker: BrokerInterface) {}

  async execute(profileId: string, inviteId: string): Promise<void> {
    const invite = await this.bandRepository.findInviteById(inviteId);
    invite.decline();
    const band = await this.bandRepository.findBandById(invite.bandId);
    await this.bandRepository.updateInvite(invite);
    await this.broker.publish(EventFactory.emitInviteDeclined({ profileId, band, role: invite.role }));
  }
}
