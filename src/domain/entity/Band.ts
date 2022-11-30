import BadRequest from "../../application/http/BadRequest";
import Forbidden from "../../application/http/Forbidden";
import MemberDTO from "../../dto/MemberDTO";
import RoleDTO from "../../dto/RoleDTO";

export default class Band {
  constructor(
    readonly bandId: string,
    readonly name: string,
    readonly description: string,
    readonly logo: string,
    readonly adminId: string,
    private members: MemberDTO[],
    private vacancies: string[] = []
  ) {}

  addMember(member: MemberDTO): void {
    this.members.push(member);
  }

  removeMember(adminId: string, profileId: string): void {
    this.verifyAdmin(adminId);
    if (adminId === profileId) throw new BadRequest("Admin cannot leave the band");
    this.members = this.members.filter((m) => m.profileId !== profileId);
  }

  getMembers(): MemberDTO[] {
    return this.members;
  }

  openVacancy(adminId: string, role: string): void {
    this.verifyAdmin(adminId);
    this.vacancies.push(role);
  }

  removeVacancy(adminId: string, role: string): void {
    this.verifyAdmin(adminId);
    const index = this.vacancies.findIndex((r) => r === role);
    this.vacancies.splice(index, 1);
  }

  getVacancies(): string[] {
    return this.vacancies;
  }

  verifyAdmin(adminId: string) {
    if (this.adminId !== adminId) throw new Forbidden("Only the admin can perform this action");
  }
}
