import { v4 as uuid } from "uuid";
import Band from "../../domain/entity/Band";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import CreateBandDTO from "../../dto/CreateBandDTO";

export default class CreateBand {
  constructor(private readonly bandRepository: BandRepositoryInterface) {}

  async execute(input: CreateBandDTO): Promise<string> {
    const bandId = uuid();
    const band = new Band(bandId, input.name, input.description, input.logo, input.adminId, []);
    await this.bandRepository.save(band);
    return bandId;
  }
}
