import EmailGatewayInterface from "../../domain/infra/gateway/EmailGatewayInterface";
import HandlerInterface from "./implements/Handler";
import UserRepositoryInterface from "../../domain/infra/repository/UserRepositoryInterface";
import { InviteAccepted } from "../../domain/event/EventFactory";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepositoryInterface";

export default class InviteAcceptedHandler implements HandlerInterface {
  name: string;
  constructor(
    private userRepository: UserRepositoryInterface,
    private profileRepository: ProfileRepositoryInterface,
    private emailGateway: EmailGatewayInterface
  ) {
    this.name = "InviteAccepted";
  }

  async handle({ payload }: InviteAccepted): Promise<void> {
    const profile = await this.profileRepository.findProfileById(payload.profileId);
    const members = payload.band.getMembers().filter((member) => member.profileId !== payload.profileId);
    let users = await Promise.all(
      members.map(async (member) => await this.userRepository.findUserById(member.profileId))
    );
    users = [...new Set(users)];
    await Promise.all(
      users.map(
        async (user) =>
          await this.emailGateway.send(
            user.email,
            `The user ${profile.nick} has accepted the invite to join the band ${payload.band.name} as a ${payload.role}!`,
            `The user ${profile.nick} has accepted the invite to join the band ${payload.band.name} as a ${payload.role}!`
          )
      )
    );
  }
}
