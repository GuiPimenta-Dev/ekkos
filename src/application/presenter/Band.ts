import Band from "../../domain/entity/Band";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";

export default class BandPresenter {
  constructor(private profileRepository: ProfileRepositoryInterface, private bandRepository: BandRepositoryInterface) {}

  async present(band: Band) {
    const roles = await this.bandRepository.findRoles();
    const vacancies = band.getVacancies();
    return {
      bandId: band.bandId,
      name: band.name,
      logo: band.logo,
      description: band.description,
      adminId: band.adminId,
      members: await Promise.all(
        band.getMembers().map(async (member) => {
          const profile = await this.profileRepository.findProfileById(member.profileId);
          return {
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
