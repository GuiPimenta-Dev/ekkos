import Event from "./implements/Event";

export default class UserCreatedEvent implements Event {
  name: string;
  constructor(readonly email: string) {
    this.name = "UserCreated";
  }
}
