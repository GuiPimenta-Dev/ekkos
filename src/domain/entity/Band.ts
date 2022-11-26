import BadRequest from "../../application/http/BadRequest";
import Forbidden from "../../application/http/Forbidden";
import Member from "./Member";

export default class Band {
  constructor(
    readonly bandId: string,
    readonly name: string,
    readonly logo: string,
    readonly admin: string,
    readonly members: Member[]
  ) {}

  addMember(userId: string, member: Member): void {
    if (this.members.find((m) => m.userId === member.userId)) throw new BadRequest("User already in band");
    if (this.admin !== userId) throw new Forbidden("Only admin can add members");
    this.members.push(member);
  }
}
