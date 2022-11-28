import EmailGatewayInterface from "../../domain/infra/gateway/EmailGateway";
import HandlerInterface from "./implements/Handler";
import UserRepositoryInterface from "../../domain/infra/repository/UserRepository";
import MemberInvitedEvent from "../../domain/event/MemberInvitedEvent";

export default class MemberInvitedHandler implements HandlerInterface {
  name: string;
  constructor(private userRepository: UserRepositoryInterface, private emailGateway: EmailGatewayInterface) {
    this.name = "MemberInvited";
  }

  async handle(event: MemberInvitedEvent): Promise<void> {
    const user = await this.userRepository.findUserById(event.profileId);
    await this.emailGateway.send(
      user.email,
      `You have been invited to join the band ${event.bandName} as a ${event.role}!`,
      `You have been invited to join the band ${event.bandName} as a ${event.role}!`
    );
  }
}
