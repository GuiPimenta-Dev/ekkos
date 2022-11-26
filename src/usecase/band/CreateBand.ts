import Band from "../../domain/entity/Band";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import { v4 as uuid } from "uuid";

export default class CreateBand {
  constructor(private readonly bandRepository: BandRepositoryInterface) {}

  async execute(userId: string, name: string, logo: string): Promise<string> {
    const bandId = uuid();
    const band = new Band(bandId, name, logo, userId, []);
    await this.bandRepository.save(band);
    return bandId;
  }
}
