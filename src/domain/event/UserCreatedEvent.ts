import DomainEvent from "./implements/DomainEvent";

export default class UserCreatedEvent implements DomainEvent {
  name: "UserCreated";
  constructor(readonly email: string) {}
}
