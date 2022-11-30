import { config } from "../../Config";
import InputDTO from "../../dto/InputDTO";
import InviteMember from "../../usecase/band/InviteMember";
import CreateBand from "../../usecase/band/CreateBand";
import GetBand from "../../usecase/band/GetBand";
import Created from "../http/Created";
import Success from "../http/Success";
import RemoveMember from "../../usecase/band/RemoveMember";
import BandPresenter from "../presenter/Band";
import AcceptInvite from "../../usecase/band/AcceptInvite";
import DeclineInvite from "../../usecase/band/DeclineInvite";
import HttpSuccess from "../http/extends/HttpSuccess";

export default class BandController {
  static async create(input: InputDTO): Promise<HttpSuccess> {
    const { body, headers, file } = input;
    const controller = new CreateBand(config.bandRepository);
    const bandId = await controller.execute({
      name: body.name,
      description: body.description,
      logo: file.location,
      profileId: headers.id,
      role: body.role,
    });
    return new Created({ bandId });
  }

  static async inviteMember(input: InputDTO): Promise<HttpSuccess> {
    const { body, headers, path } = input;
    const controller = new InviteMember(config.bandRepository, config.profileRepository, config.broker);
    const invitationId = await controller.execute({
      bandId: path.id,
      adminId: headers.id,
      profileId: body.profileId,
      role: body.role,
    });
    return new Success({ invitationId });
  }

  static async acceptInvitation(input: InputDTO): Promise<HttpSuccess> {
    const { path, headers } = input;
    const controller = new AcceptInvite(config.bandRepository, config.broker);
    await controller.execute(headers.id, path.id);
    return new Success();
  }

  static async declineInvitation(input: InputDTO): Promise<HttpSuccess> {
    const { path, headers } = input;
    const controller = new DeclineInvite(config.bandRepository, config.broker);
    await controller.execute(headers.id, path.id);
    return new Success();
  }

  static async removeMember(input: InputDTO): Promise<HttpSuccess> {
    const { path, body, headers } = input;
    const controller = new RemoveMember(config.bandRepository);
    const band = await controller.execute(path.id, headers.id, body.profileId);
    return new Success(band);
  }

  static async get(input: InputDTO): Promise<HttpSuccess> {
    const { path } = input;
    const controller = new GetBand(config.bandRepository);
    const band = await controller.execute(path.id);
    const presenter = new BandPresenter(config.profileRepository);
    const data = await presenter.present(band);
    return new Success(data);
  }
}
