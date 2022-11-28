import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";

export default class GetBand {
  constructor(private bandRepository: BandRepositoryInterface) {}

  async execute(id: string): Promise<any> {
    return await this.bandRepository.findBandById(id);
  }
}
