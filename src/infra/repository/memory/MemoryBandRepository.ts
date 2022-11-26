import Band from "../../../domain/entity/Band";
import BandRepositoryInterface from "../../../domain/infra/repository/BandRepository";

export default class MemoryBandRepository implements BandRepositoryInterface {
  readonly bands: Band[] = [];

  async save(band: Band): Promise<void> {
    this.bands.push(band);
  }
}
