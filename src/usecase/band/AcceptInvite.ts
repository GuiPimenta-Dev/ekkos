import BandRepositoryInterface from "../../application/ports/repository/BandRepositoryInterface";
import BrokerInterface from "../../application/ports/broker/BrokerInterface";
import EventFactory from "../../domain/event/EventFactory";
import Member from "../../domain/entity/band/Member";

export default class AcceptInvite {
  constructor(private bandRepository: BandRepositoryInterface, private broker: BrokerInterface) {}

  async execute(profileId: string, inviteId: string): Promise<string> {
    const invite = await this.bandRepository.findInviteById(inviteId);
    const band = await this.bandRepository.findBandById(invite.bandId);
    invite.accept();
    const member = Member.create(profileId, invite.role);
    band.addMember(band.adminId, member);
    await this.bandRepository.update(band);
    await this.bandRepository.updateInvite(invite);
    await this.broker.publish(EventFactory.emitInviteAccepted({ profileId, band, role: invite.role }));
    return member.id;
  }
}
