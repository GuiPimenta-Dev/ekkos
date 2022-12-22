import BandRepositoryInterface from "../../application/ports/repository/BandRepositoryInterface";
import NotFound from "../../application/http/NotFound";

export default class RemoveMember {
  constructor(private readonly bandRepository: BandRepositoryInterface) {}

  async execute(bandId: string, adminId: string, memberId: string): Promise<void> {
    const band = await this.bandRepository.findBandById(bandId);
    const member = band.getMembers().find((m) => m.memberId == memberId);
    if (!member) throw new NotFound("Member not found");
    band.removeMember(adminId, member);
    await this.bandRepository.update(band);
  }
}
