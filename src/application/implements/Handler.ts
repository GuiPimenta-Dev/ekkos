import DomainEvent from "../../domain/event/implements/DomainEvent";

export default interface HandlerInterface {
  name: string;
  handle(event: DomainEvent): void;
}
