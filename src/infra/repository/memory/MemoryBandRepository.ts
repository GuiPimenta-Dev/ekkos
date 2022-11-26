import Band from "../../../domain/entity/Band";
import BandRepositoryInterface from "../../../domain/infra/repository/BandRepository";

export default class MemoryBandRepository implements BandRepositoryInterface {
  readonly bands: Band[] = [];

  async save(band: Band): Promise<void> {
    this.bands.push(band);
  }

  async findBandById(id: string): Promise<Band> {
    return this.bands.find((band) => band.bandId === id);
  }

  async update(band: Band): Promise<void> {
    const index = this.bands.indexOf(band);
    this.bands[index] = band;
  }
}
