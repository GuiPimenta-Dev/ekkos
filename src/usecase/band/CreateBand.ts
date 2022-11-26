import Band from "../../domain/entity/Band";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import { v4 as uuid } from "uuid";

export default class CreateBand {
  constructor(private readonly bandRepository: BandRepositoryInterface) {}

  async execute(admin: string, name: string, picture: string): Promise<string> {
    const bandId = uuid();
    const band = new Band(bandId, name, picture, admin, []);
    await this.bandRepository.save(band);
    return bandId;
  }
}
