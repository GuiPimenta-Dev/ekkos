import NotFound from "../../application/http/NotFound";
import BandRepositoryInterface from "../../application/ports/repository/BandRepositoryInterface";
import ProfileRepositoryInterface from "../../application/ports/repository/ProfileRepositoryInterface";
import AddMemberDTO from "../../dto/AddMemberDTO";
import { v4 as uuid } from "uuid";
import BrokerInterface from "../../application/ports/broker/BrokerInterface";
import EventFactory from "../../domain/event/EventFactory";
import Member from "../../domain/entity/band/Member";
import Band from "../../domain/entity/band/Band";
import Invite, { Status } from "../../domain/entity/band/Invite";

export default class InviteMember {
  constructor(
    private readonly bandRepository: BandRepositoryInterface,
    private profileRepository: ProfileRepositoryInterface,
    private broker: BrokerInterface,
  ) {}

  async execute(input: AddMemberDTO): Promise<string> {
    const band = await this.bandRepository.findBandById(input.bandId);
    const profile = await this.profileRepository.findProfileById(input.profileId);
    if (!profile) throw new NotFound("Profile not found");
    if (input.adminId === input.profileId) {
      await this.addAnotherRoleToAdmin(band, input.profileId, input.role);
    } else {
      return await this.inviteMemberToJoinBand(band, input.profileId, input.role);
    }
  }

  private async addAnotherRoleToAdmin(band: Band, profileId: string, role: string) {
    const member = Member.create(profileId, role);
    band.addMember(profileId, member);
    await this.bandRepository.update(band);
  }

  private async inviteMemberToJoinBand(band: Band, profileId: string, role: string) {
    const invite = Invite.create(band.id, profileId, role);
    await this.bandRepository.createInvite(invite);
    await this.broker.publish(EventFactory.emitMemberInvited({ profileId, bandName: band.name, role }));
    return invite.id;
  }
}
