import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import BrokerInterface from "../../domain/infra/broker/Broker";
import { Status } from "../../dto/InviteDTO";
import EventFactory from "../../domain/event/EventFactory";

export default class AcceptInvite {
  constructor(private bandRepository: BandRepositoryInterface, private broker: BrokerInterface) {}

  async execute(profileId: string, inviteId: string): Promise<void> {
    const invite = await this.bandRepository.findInviteById(inviteId);
    const band = await this.bandRepository.findBandById(invite.bandId);
    band.addMember({ profileId, bandId: invite.bandId, role: invite.role });
    await this.bandRepository.update(band);
    await this.bandRepository.updateInvite({ ...invite, status: Status.accepted });
    await this.broker.publish(EventFactory.emitInviteAccepted({ profileId, band, role: invite.role }));
  }
}
