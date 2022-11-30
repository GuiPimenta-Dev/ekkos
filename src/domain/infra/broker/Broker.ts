import HandlerInterface from "../../../application/handler/implements/Handler";
import { Event } from "../../event/EventFactory";

export default interface BrokerInterface {
  handlers: HandlerInterface[];
  register(handler: HandlerInterface): void;
  publish(event: Event): Promise<void>;
}
