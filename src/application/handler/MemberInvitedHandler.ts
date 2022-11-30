import EmailGatewayInterface from "../../domain/infra/gateway/EmailGateway";
import HandlerInterface from "./implements/Handler";
import UserRepositoryInterface from "../../domain/infra/repository/UserRepository";
import { Event, MemberInvited } from "../../domain/event/EventFactory";

export default class MemberInvitedHandler implements HandlerInterface {
  name: string;
  constructor(private userRepository: UserRepositoryInterface, private emailGateway: EmailGatewayInterface) {
    this.name = "MemberInvited";
  }

  async handle({ payload }: Event<MemberInvited>): Promise<void> {
    const user = await this.userRepository.findUserById(payload.profileId);
    await this.emailGateway.send(
      user.email,
      `You have been invited to join the band ${payload.bandName} as a ${payload.role}!`,
      `You have been invited to join the band ${payload.bandName} as a ${payload.role}!`
    );
  }
}
