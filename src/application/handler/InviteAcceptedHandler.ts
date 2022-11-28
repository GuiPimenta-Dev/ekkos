import EmailGatewayInterface from "../../domain/infra/gateway/EmailGateway";
import HandlerInterface from "./implements/Handler";
import UserRepositoryInterface from "../../domain/infra/repository/UserRepository";
import InviteAcceptedEvent from "../../domain/event/InviteAcceptedEvent";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";

export default class InviteAcceptedHandler implements HandlerInterface {
  name: string;
  constructor(
    private userRepository: UserRepositoryInterface,
    private profileRepository: ProfileRepositoryInterface,
    private emailGateway: EmailGatewayInterface
  ) {
    this.name = "InviteAccepted";
  }

  async handle(event: InviteAcceptedEvent): Promise<void> {
    const profile = await this.profileRepository.findProfileById(event.profileId);
    const members = event.band.getMembers().filter((member) => member.profileId !== event.profileId);
    const users = await Promise.all(
      members.map(async (member) => await this.userRepository.findUserById(member.profileId))
    );
    await Promise.all(
      users.map(
        async (user) =>
          await this.emailGateway.send(
            user.email,
            `The user ${profile.nick} has accepted the invitation to join the band ${event.band.name} as a ${event.role}!`,
            `The user ${profile.nick} has accepted the invitation to join the band ${event.band.name} as a ${event.role}!`
          )
      )
    );
  }
}
