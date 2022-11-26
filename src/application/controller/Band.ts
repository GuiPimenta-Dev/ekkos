import { config } from "../../Config";
import InputDTO from "../../dto/InputDTO";
import AddMember from "../../usecase/band/AddMember";
import CreateBand from "../../usecase/band/CreateBand";
import GetBand from "../../usecase/band/GetBand";
import Created from "../http/Created";
import Success from "../http/Success";

export default class BandController {
  static async create(input: InputDTO): Promise<Created> {
    const { body, headers, file } = input;
    const controller = new CreateBand(config.bandRepository);
    const bandId = await controller.execute({
      name: body.name,
      description: body.description,
      logo: file,
      adminId: headers.id,
    });
    return new Created({ bandId });
  }

  static async addMember(input: InputDTO): Promise<Success> {
    const { body, headers, path } = input;
    const controller = new AddMember(config.bandRepository, config.profileRepository);
    await controller.execute({ bandId: path.id, adminId: headers.id, profileId: body.profileId, role: body.role });
    return new Success();
  }

  static async get(input: InputDTO): Promise<Success> {
    const { path } = input;
    const controller = new GetBand(config.bandRepository, config.profileRepository);
    const band = await controller.execute(path.id);
    return new Success(band);
  }
}
