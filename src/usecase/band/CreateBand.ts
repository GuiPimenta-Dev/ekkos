import { v4 as uuid } from "uuid";
import Band from "../../domain/entity/Band";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepositoryInterface";
import CreateBandDTO from "../../dto/CreateBandDTO";

export default class CreateBand {
  constructor(private readonly bandRepository: BandRepositoryInterface) {}

  async execute(input: CreateBandDTO): Promise<string> {
    const bandId = uuid();
    const member = { memberId: uuid(), profileId: input.profileId, role: "admin" };
    const band = new Band(bandId, input.name, input.description, input.logo, input.profileId, [member]);
    await this.bandRepository.save(band);
    return bandId;
  }
}
