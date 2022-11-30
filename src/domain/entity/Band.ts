import BadRequest from "../../application/http/BadRequest";
import Forbidden from "../../application/http/Forbidden";
import MemberDTO from "../../dto/MemberDTO";

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

  addMember(adminId: string, member: MemberDTO): void {
    this.verifyAdmin(adminId);
    if (this.getVacancies().includes(member.role)) {
      this.removeVacancy(adminId, member.role);
    }
    this.members.push(member);
  }

  removeMember(adminId: string, member: MemberDTO): void {
    this.verifyAdmin(adminId);
    if (member.role === "admin") throw new Forbidden("Admin cannot leave the band");
    this.members = this.members.filter((m) => m !== member);
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

  private verifyAdmin(adminId: string) {
    if (this.adminId !== adminId) throw new Forbidden("Only the admin can perform this action");
  }
}
