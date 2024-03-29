import { config } from "../../Config";
import InputDTO from "../../dto/InputDTO";
import InviteMember from "../../usecase/band/InviteMember";
import CreateBand from "../../usecase/band/CreateBand";
import Created from "../http/Created";
import Success from "../http/Success";
import RemoveMember from "../../usecase/band/RemoveMember";
import BandPresenter from "../presenter/BandPresenter";
import AcceptInvite from "../../usecase/band/AcceptInvite";
import DeclineInvite from "../../usecase/band/DeclineInvite";
import HttpSuccess from "../http/extends/HttpSuccess";
import OpenVacancy from "../../usecase/band/OpenVacancy";

export default class BandController {
  static async create(input: InputDTO): Promise<HttpSuccess> {
    const { body, headers, file } = input;
    const usecase = new CreateBand(config.bandRepository);
    const bandId = await usecase.execute({
      name: body.name,
      description: body.description,
      logo: file.location,
      profileId: headers.id,
    });
    return new Created({ bandId });
  }

  static async inviteMember(input: InputDTO): Promise<HttpSuccess> {
    const { body, headers, path } = input;
    const usecase = new InviteMember(config.bandRepository, config.profileRepository, config.broker);
    const inviteId = await usecase.execute({
      bandId: path.id,
      adminId: headers.id,
      profileId: body.profileId,
      role: body.role,
    });
    return new Success({ inviteId });
  }

  static async acceptInvite(input: InputDTO): Promise<HttpSuccess> {
    const { path, headers } = input;
    const usecase = new AcceptInvite(config.bandRepository, config.broker);
    await usecase.execute(headers.id, path.id);
    return new Success();
  }

  static async declineInvite(input: InputDTO): Promise<HttpSuccess> {
    const { path, headers } = input;
    const usecase = new DeclineInvite(config.bandRepository, config.broker);
    await usecase.execute(headers.id, path.id);
    return new Success();
  }

  static async removeMember(input: InputDTO): Promise<HttpSuccess> {
    const { path, body, headers } = input;
    const usecase = new RemoveMember(config.bandRepository);
    const band = await usecase.execute(path.id, headers.id, body.memberId);
    return new Success(band);
  }

  static async get(input: InputDTO): Promise<HttpSuccess> {
    const { path } = input;
    const presenter = new BandPresenter(config.bandRepository, config.profileRepository);
    const data = await presenter.present(path.id);
    return new Success(data);
  }

  static async openVacancy(input: InputDTO): Promise<HttpSuccess> {
    const { headers, path, body } = input;
    const usecase = new OpenVacancy(config.bandRepository);
    await usecase.execute(headers.id, path.id, body.role);
    return new Success();
  }

  static async getRoles(): Promise<HttpSuccess> {
    const roles = await config.bandRepository.findRoles();
    return new Success({ roles });
  }
}
