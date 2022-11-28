import Command from "./implements/Command";

export default class InviteMemberCommand implements Command {
  name: string;
  constructor(readonly profileId: string, readonly bandId: string, readonly bandName: string, readonly role: string) {
    this.name = "InviteMember";
  }
}
