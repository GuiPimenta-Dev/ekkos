import HandlerInterface from "../../application/handler/implements/Handler";
import BrokerInterface from "../../domain/infra/broker/Broker";
import { Event } from "../../domain/event/EventFactory";

export default class MemoryBroker implements BrokerInterface {
  handlers: HandlerInterface[];

  constructor() {
    this.handlers = [];
  }

  register(handler: HandlerInterface) {
    this.handlers.push(handler);
  }

  async publish(event: Event): Promise<void> {
    for (const handler of this.handlers) {
      if (handler.name === event.name) {
        await handler.handle(event);
      }
    }
  }
}
