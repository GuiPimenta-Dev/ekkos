import HandlerInterface from "../../handler/implements/Handler";
import { Event } from "../../../domain/event/EventFactory";

export default interface BrokerInterface {
  handlers: HandlerInterface[];
  register(handler: HandlerInterface): void;
  publish(action: Event): Promise<void>;
}
