import { v4 as uuid } from "uuid";
import Band from "../../domain/entity/Band";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";

export default class CreateBand {
  constructor(private readonly bandRepository: BandRepositoryInterface) {}

  async execute(admin: string, name: string, logo: string): Promise<string> {
    const bandId = uuid();
    const band = new Band(bandId, name, logo, admin, []);
    await this.bandRepository.save(band);
    return bandId;
  }
}
