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
    private members: MemberDTO[]
  ) {}

  addMember(member: MemberDTO): void {
    if (this.members.find((m) => m.profileId === member.profileId)) throw new BadRequest("User already in band");
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

  verifyAdmin(adminId: string) {
    if (this.adminId !== adminId) throw new Forbidden("Only the admin can perform this action");
  }
}
