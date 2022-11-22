import HandlerInterface from "../../../application/implements/Handler";
import DomainEvent from "../../event/implements/DomainEvent";

export default interface BrokerInterface {
  handlers: HandlerInterface[];
  register(handler: HandlerInterface): void;
  publish(event: DomainEvent): void;
}
