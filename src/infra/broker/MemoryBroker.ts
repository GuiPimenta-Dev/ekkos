import HandlerInterface from "../../application/handler/implements/Handler";
import BrokerInterface from "../../domain/infra/broker/Broker";
import { Event } from "../../domain/event/EventFactory";
import { Command } from "../../domain/command/CommandFactory";

export default class MemoryBroker implements BrokerInterface {
  handlers: HandlerInterface[];

  constructor() {
    this.handlers = [];
  }

  register(handler: HandlerInterface) {
    this.handlers.push(handler);
  }

  async publish(action: Command | Event): Promise<void> {
    for (const handler of this.handlers) {
      if (handler.name === action.name) {
        await handler.handle(action);
      }
    }
  }
}
