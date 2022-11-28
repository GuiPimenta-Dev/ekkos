import Event from "./implements/Event";
import Band from "../entity/Band";

export default class InviteDeclinedEvent implements Event {
  name: string;
  constructor(readonly profileId: string, readonly band: Band, readonly role: string) {
    this.name = "InviteDeclined";
  }
}
