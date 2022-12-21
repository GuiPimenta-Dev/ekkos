import BandRepositoryInterface from "../../application/infra/repository/BandRepositoryInterface";
import BrokerInterface from "../../application/infra/broker/BrokerInterface";
import { Status } from "../../dto/InviteDTO";
import EventFactory from "../../domain/event/EventFactory";
import { v4 as uuid } from "uuid";

export default class AcceptInvite {
  constructor(private bandRepository: BandRepositoryInterface, private broker: BrokerInterface) {}

  async execute(profileId: string, inviteId: string): Promise<void> {
    const invite = await this.bandRepository.findInviteById(inviteId);
    const band = await this.bandRepository.findBandById(invite.bandId);
    const memberId = uuid();
    band.addMember(band.adminId, { memberId, profileId, role: invite.role });
    await this.bandRepository.update(band);
    await this.bandRepository.updateInvite({ ...invite, status: Status.accepted });
    await this.broker.publish(EventFactory.emitInviteAccepted({ profileId, band, role: invite.role }));
    return memberId;
  }
}
