import HandlerInterface from "../../application/handler/implements/Handler";
import BrokerInterface from "../../application/infra/broker/BrokerInterface";
import { Event } from "../../domain/event/EventFactory";

export default class MemoryBroker implements BrokerInterface {
  handlers: HandlerInterface[];

  constructor() {
    this.handlers = [];
  }

  register(handler: HandlerInterface) {
    this.handlers.push(handler);
  }

  async publish(action: Event): Promise<void> {
    for (const handler of this.handlers) {
      if (handler.name === action.name) {
        await handler.handle(action);
      }
    }
  }
}
