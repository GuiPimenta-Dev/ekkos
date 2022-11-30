import EmailGatewayInterface from "../../domain/infra/gateway/EmailGateway";
import HandlerInterface from "./implements/Handler";
import UserRepositoryInterface from "../../domain/infra/repository/UserRepository";
import { Event, InviteAccepted } from "../../domain/event/EventFactory";
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

  async handle({ payload }: Event<InviteAccepted>): Promise<void> {
    const profile = await this.profileRepository.findProfileById(payload.profileId);
    const members = payload.band.getMembers().filter((member) => member.profileId !== payload.profileId);
    const users = await Promise.all(
      members.map(async (member) => await this.userRepository.findUserById(member.profileId))
    );
    await Promise.all(
      users.map(
        async (user) =>
          await this.emailGateway.send(
            user.email,
            `The user ${profile.nick} has accepted the invitation to join the band ${payload.band.name} as a ${payload.role}!`,
            `The user ${profile.nick} has accepted the invitation to join the band ${payload.band.name} as a ${payload.role}!`
          )
      )
    );
  }
}
