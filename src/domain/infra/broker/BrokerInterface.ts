import HandlerInterface from "../../../application/handler/implements/Handler";
import { Command } from "../../command/CommandFactory";
import { Event } from "../../event/EventFactory";

export default interface BrokerInterface {
  handlers: HandlerInterface[];
  register(handler: HandlerInterface): void;
  publish(action: Command | Event): Promise<void>;
}
