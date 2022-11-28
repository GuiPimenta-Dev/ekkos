import InviteMemberCommand from "../../domain/command/InviteMemberCommand";
import EmailGatewayInterface from "../../domain/infra/gateway/EmailGateway";
import HandlerInterface from "./implements/Handler";
import UserRepositoryInterface from "../../domain/infra/repository/UserRepository";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import { v4 as uuid } from "uuid";
import { Status } from "../../dto/InvitationDTO";

export default class InviteMemberHandler implements HandlerInterface {
  name: string;
  constructor(
    private userRepository: UserRepositoryInterface,
    private bandRepository: BandRepositoryInterface,
    private emailGateway: EmailGatewayInterface
  ) {
    this.name = "InviteMember";
  }

  async handle(command: InviteMemberCommand): Promise<void> {
    const user = await this.userRepository.findUserById(command.profileId);
    const input = {
      invitationId: uuid(),
      bandId: command.bandId,
      profileId: command.profileId,
      role: command.role,
      status: Status.pending,
    };
    await this.bandRepository.createInvitation(input);
    await this.emailGateway.send(
      user.email,
      `You have been invited to join the band ${command.bandName} as a ${command.role}!`,
      `You have been invited to join the band ${command.bandName} as a ${command.role}!`
    );
  }
}
