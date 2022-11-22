import DomainEvent from "./implements/DomainEvent";

export default class UserCreatedEvent implements DomainEvent {
  name: string;
  constructor(readonly email: string) {
    this.name = "UserCreated";
  }
}
