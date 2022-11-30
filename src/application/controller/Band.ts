import { config } from "../../Config";
import InputDTO from "../../dto/InputDTO";
import InviteMember from "../../usecase/Band/InviteMember";
import CreateBand from "../../usecase/Band/CreateBand";
import GetBand from "../../usecase/Band/GetBand";
import Created from "../http/Created";
import Success from "../http/Success";
import RemoveMember from "../../usecase/Band/RemoveMember";
import BandPresenter from "../presenter/Band";
import AcceptInvitation from "../../usecase/Band/AcceptInvitation";
import DeclineInvitation from "../../usecase/Band/DeclineInvitation";
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
    const controller = new AcceptInvitation(config.bandRepository, config.broker);
    await controller.execute(headers.id, path.id);
    return new Success();
  }

  static async declineInvitation(input: InputDTO): Promise<HttpSuccess> {
    const { path, headers } = input;
    const controller = new DeclineInvitation(config.bandRepository, config.broker);
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
