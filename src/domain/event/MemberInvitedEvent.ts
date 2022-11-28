import Event from "./implements/Event";

export default class MemberInvitedEvent implements Event {
  name: string;
  constructor(readonly profileId: string, readonly bandName: string, readonly role: string) {
    this.name = "MemberInvited";
  }
}
