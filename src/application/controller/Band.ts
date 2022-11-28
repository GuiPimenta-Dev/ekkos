import { config } from "../../Config";
import InputDTO from "../../dto/InputDTO";
import InviteMember from "../../usecase/band/InviteMember";
import CreateBand from "../../usecase/band/CreateBand";
import GetBand from "../../usecase/band/GetBand";
import Created from "../http/Created";
import Success from "../http/Success";
import RemoveMember from "../../usecase/band/RemoveMember";
import BandPresenter from "../presenter/Band";

export default class BandController {
  static async create(input: InputDTO): Promise<Created> {
    const { body, headers, file } = input;
    const controller = new CreateBand(config.bandRepository);
    const bandId = await controller.execute({
      name: body.name,
      description: body.description,
      logo: file.location,
      adminId: headers.id,
      role: body.role,
    });
    return new Created({ bandId });
  }

  static async addMember(input: InputDTO): Promise<Success> {
    const { body, headers, path } = input;
    const controller = new InviteMember(config.bandRepository, config.profileRepository);
    await controller.execute({ bandId: path.id, adminId: headers.id, profileId: body.profileId, role: body.role });
    return new Success();
  }

  static async get(input: InputDTO): Promise<Success> {
    const { path } = input;
    const controller = new GetBand(config.bandRepository);
    const band = await controller.execute(path.id);
    const presenter = new BandPresenter(config.profileRepository);
    const data = await presenter.present(band);
    return new Success(data);
  }

  static async removeMember(input: InputDTO): Promise<Success> {
    const { path, body, headers } = input;
    const controller = new RemoveMember(config.bandRepository);
    const band = await controller.execute(path.id, headers.id, body.profileId);
    return new Success(band);
  }
}
