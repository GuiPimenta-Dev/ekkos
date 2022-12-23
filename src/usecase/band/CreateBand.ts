import { v4 as uuid } from "uuid";
import Band from "../../domain/entity/band/Band";
import BandRepositoryInterface from "../../application/ports/repository/BandRepositoryInterface";
import CreateBandDTO from "../../dto/CreateBandDTO";

export default class CreateBand {
  constructor(private readonly bandRepository: BandRepositoryInterface) {}

  async execute(input: CreateBandDTO): Promise<string> {
    const bandId = uuid();
    const band = Band.create(input.name, input.description, input.logo, input.profileId);
    await this.bandRepository.create(band);
    return bandId;
  }
}
