import BandRepositoryInterface from "../../application/ports/repository/BandRepositoryInterface";
import BrokerInterface from "../../application/ports/broker/BrokerInterface";
import EventFactory from "../../domain/event/EventFactory";
import Member from "../../domain/entity/band/Member";
import { v4 as uuid } from "uuid";
import { Status } from "../../domain/entity/band/Invite";

export default class AcceptInvite {
  constructor(private bandRepository: BandRepositoryInterface, private broker: BrokerInterface) {}

  async execute(profileId: string, inviteId: string): Promise<string> {
    const invite = await this.bandRepository.findInviteById(inviteId);
    invite.accept();
    const band = await this.bandRepository.findBandById(invite.bandId);
    const member = new Member(uuid(), profileId, invite.role);
    band.addMember(band.adminId, member);
    await this.bandRepository.update(band);
    await this.bandRepository.updateInvite(invite);
    await this.broker.publish(EventFactory.emitInviteAccepted({ profileId, band, role: invite.role }));
    return member.memberId;
  }
}
