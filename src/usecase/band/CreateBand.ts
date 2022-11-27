import { v4 as uuid } from "uuid";
import NotFound from "../../application/http/NotFound";
import Band from "../../domain/entity/Band";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";
import CreateBandDTO from "../../dto/CreateBandDTO";
import Forbidden from "../../application/http/Forbidden";
import Member from "../../domain/entity/Member";

export default class CreateBand {
  constructor(private readonly bandRepository: BandRepositoryInterface) {}

  async execute(input: CreateBandDTO): Promise<string> {
    const bandId = uuid();
    const isRoleValid = await this.bandRepository.isRoleValid(input.role);
    if (!isRoleValid) throw new Forbidden("Role is invalid");
    const member = new Member(input.adminId, bandId, input.role);
    const band = new Band(bandId, input.name, input.description, input.logo, input.adminId, [member]);
    await this.bandRepository.save(band);
    return bandId;
  }
}
