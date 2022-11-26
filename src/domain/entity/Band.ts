import BadRequest from "../../application/http/BadRequest";
import Forbidden from "../../application/http/Forbidden";
import Member from "./Member";

export default class Band {
  constructor(
    readonly bandId: string,
    readonly name: string,
    readonly description: string,
    readonly logo: string,
    readonly admin: string,
    private members: Member[]
  ) {}

  addMember(userId: string, member: Member): void {
    this.verifyAdmin(userId);
    if (this.members.find((m) => m.userId === member.userId)) throw new BadRequest("User already in band");
    this.members.push(member);
  }

  getMembers(): Member[] {
    return this.members;
  }

  private verifyAdmin(userId: string) {
    if (this.admin !== userId) throw new Forbidden("Only the admin can perform this action");
  }
}
