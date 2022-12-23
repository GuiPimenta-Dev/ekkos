import Forbidden from "../../../application/http/Forbidden";
import Member from "./Member";
import { v4 as uuid } from "uuid";

export default class Band {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly logo: string,
    readonly adminId: string,
    private members: Member[],
    private vacancies: string[] = [],
  ) {}

  static create(name: string, description: string, logo: string, adminId: string): Band {
    const member = new Member(uuid(), adminId, "admin");
    return new Band(uuid(), name, description, logo, adminId, [member]);
  }

  addMember(adminId: string, member: Member): void {
    this.verifyAdmin(adminId);
    if (this.getVacancies().includes(member.role)) {
      this.removeVacancy(adminId, member.role);
    }
    this.members.push(member);
  }

  removeMember(adminId: string, member: Member): void {
    this.verifyAdmin(adminId);
    if (member.role === "admin") throw new Forbidden("Admin cannot leave the band");
    this.members = this.members.filter((m) => m !== member);
  }

  getMembers(): Member[] {
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
