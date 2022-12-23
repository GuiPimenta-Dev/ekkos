import { v4 as uuid } from "uuid";
import Band from "../../domain/entity/band/Band";
import BandRepositoryInterface from "../../application/ports/repository/BandRepositoryInterface";
import CreateBandDTO from "../../dto/CreateBandDTO";
import Member from "../../domain/entity/band/Member";

export default class CreateBand {
  constructor(private readonly bandRepository: BandRepositoryInterface) {}

  async execute(input: CreateBandDTO): Promise<string> {
    const bandId = uuid();
    const member = new Member(uuid(), input.profileId, "admin");
    const band = new Band(bandId, input.name, input.description, input.logo, input.profileId, [member]);
    await this.bandRepository.create(band);
    return bandId;
  }
}
