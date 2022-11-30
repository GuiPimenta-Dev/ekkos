import RoleDTO from "../../dto/RoleDTO";
import BandRepositoryInterface from "../../domain/infra/repository/BandRepository";

export default class GetRoles {
  constructor(private bandRepository: BandRepositoryInterface) {}

  async execute(): Promise<RoleDTO[]> {
    return await this.bandRepository.findRoles();
  }
}
