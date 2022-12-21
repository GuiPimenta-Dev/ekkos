import BandRepositoryInterface from "../../application/infra/repository/BandRepositoryInterface";
import BrokerInterface from "../../application/infra/broker/BrokerInterface";
import { Status } from "../../dto/InviteDTO";
import EventFactory from "../../domain/event/EventFactory";

export default class DeclineInvite {
  constructor(private bandRepository: BandRepositoryInterface, private broker: BrokerInterface) {}

  async execute(profileId: string, inviteId: string): Promise<void> {
    const invite = await this.bandRepository.findInviteById(inviteId);
    const band = await this.bandRepository.findBandById(invite.bandId);
    await this.bandRepository.updateInvite({ ...invite, status: Status.declined });
    await this.broker.publish(EventFactory.emitInviteDeclined({ profileId, band, role: invite.role }));
  }
}
