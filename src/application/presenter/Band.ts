import Band from "../../domain/entity/Band";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";

export default class BandPresenter {
  constructor(private profileRepository: ProfileRepositoryInterface) {}

  async present(band: Band) {
    return {
      bandId: band.bandId,
      name: band.name,
      description: band.description,
      members: await Promise.all(
        band.getMembers().map(async (member) => {
          const profile = await this.profileRepository.findProfileById(member.userId);
          return {
            userId: member.userId,
            nick: profile.nick,
            avatar: profile.avatar,
            role: member.role,
          };
        })
      ),
    };
  }
}
