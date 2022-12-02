import Band from "../../domain/entity/Band";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepositoryInterface";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepositoryInterface";

export default class BandPresenter {
  constructor(private bandRepository: BandRepositoryInterface, private profileRepository: ProfileRepositoryInterface) {}

  async present(bandId: string) {
    const band = await this.bandRepository.findBandById(bandId);
    const roles = await this.bandRepository.findRoles();
    const vacancies = band.getVacancies();
    return {
      bandId: band.bandId,
      name: band.name,
      logo: band.logo,
      description: band.description,
      members: await Promise.all(
        band.getMembers().map(async (member) => {
          const profile = await this.profileRepository.findProfileById(member.profileId);
          return {
            memberId: member.memberId,
            profileId: member.profileId,
            nick: profile.nick,
            avatar: profile.avatar,
            role: member.role,
          };
        })
      ),
      vacancies: vacancies.map((vacancy) => {
        return roles.find((role) => role.role === vacancy);
      }),
    };
  }
}
