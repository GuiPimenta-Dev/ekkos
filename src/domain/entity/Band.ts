import Member from "./Member";

export default class Band {
  constructor(
    readonly bandId: string,
    readonly name: string,
    readonly logo: string,
    readonly admin: string,
    readonly members: Member[]
  ) {}

  addMember(member: Member): void {
    this.members.push(member);
  }
}
