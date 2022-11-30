import EmailGatewayInterface from "../../domain/infra/gateway/EmailGateway";
import HandlerInterface from "./implements/Handler";
import UserRepositoryInterface from "../../domain/infra/repository/UserRepository";
import { InviteMember } from "../../domain/command/CommandFactory";

export default class InviteMemberHandler implements HandlerInterface {
  name: string;
  constructor(private userRepository: UserRepositoryInterface, private emailGateway: EmailGatewayInterface) {
    this.name = "InviteMember";
  }

  async handle({ payload }: InviteMember): Promise<void> {
    const user = await this.userRepository.findUserById(payload.profileId);
    await this.emailGateway.send(
      user.email,
      `You have been invited to join the band ${payload.bandName} as a ${payload.role}!`,
      `You have been invited to join the band ${payload.bandName} as a ${payload.role}!`
    );
  }
}
