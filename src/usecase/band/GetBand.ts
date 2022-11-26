import NotFound from "../../application/http/NotFound";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import ProfileRepositoryInterface from "../../domain/infra/repository/ProfileRepository";

export default class GetBand {
  constructor(private bandRepository: BandRepositoryInterface, private profileRepository: ProfileRepositoryInterface) {}

  async execute(id: string): Promise<any> {
    const band = await this.bandRepository.findBandById(id);
    if (!band) throw new NotFound("Band not found");
    const members = await Promise.all(
      band.getMembers().map(async (member) => {
        const profile = await this.profileRepository.findProfileById(member.userId);
        return {
          userId: member.userId,
          nick: profile.nick,
          avatar: profile.avatar,
          role: member.role,
        };
      })
    );
    return { ...band, members };
  }
}
