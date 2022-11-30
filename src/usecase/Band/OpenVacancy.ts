import BandRepositoryInterface from "../../domain/infra/repository/BandRepositoryInterface";

export default class OpenVacancy {
  constructor(private bandRepository: BandRepositoryInterface) {}

  async execute(adminId: string, bandId: string, role: string): Promise<void> {
    const band = await this.bandRepository.findBandById(bandId);
    band.openVacancy(adminId, role);
    await this.bandRepository.update(band);
  }
}
