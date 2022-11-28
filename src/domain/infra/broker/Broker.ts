import HandlerInterface from "../../../application/handler/implements/Handler";
import Event from "../../event/implements/Event";

export default interface BrokerInterface {
  handlers: HandlerInterface[];
  register(handler: HandlerInterface): void;
  publish(event: Event): void;
}
