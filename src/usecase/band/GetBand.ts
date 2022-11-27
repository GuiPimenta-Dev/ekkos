import NotFound from "../../application/http/NotFound";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";

export default class GetBand {
  constructor(private bandRepository: BandRepositoryInterface) {}

  async execute(id: string): Promise<any> {
    const band = await this.bandRepository.findBandById(id);
    if (!band) throw new NotFound("Band not found");
    return band;
  }
}
