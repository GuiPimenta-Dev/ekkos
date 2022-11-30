import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";

export default class RemoveMember {
  constructor(private readonly bandRepository: BandRepositoryInterface) {}

  async execute(bandId: string, adminId: string, profileId: string): Promise<void> {
    const band = await this.bandRepository.findBandById(bandId);
    band.removeMember(adminId, profileId);
    await this.bandRepository.update(band);
  }
}
