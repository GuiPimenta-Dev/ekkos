import EmailGatewayInterface from "../ports/gateway/EmailGatewayInterface";
import HandlerInterface from "./implements/Handler";
import UserRepositoryInterface from "../ports/repository/UserRepositoryInterface";
import { Memberinvited } from "../../domain/event/EventFactory";

export default class InviteMemberHandler implements HandlerInterface {
  name: string;
  constructor(private userRepository: UserRepositoryInterface, private emailGateway: EmailGatewayInterface) {
    this.name = "MemberInvited";
  }

  async handle({ payload }: Memberinvited): Promise<void> {
    const user = await this.userRepository.findUserById(payload.profileId);
    await this.emailGateway.send(
      user.email,
      `You have been invited to join the band ${payload.bandName} as a ${payload.role}!`,
      `You have been invited to join the band ${payload.bandName} as a ${payload.role}!`
    );
  }
}
