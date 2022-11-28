import HandlerInterface from "../../../../src/application/handler/implements/Handler";
import Event from "../../../../src/domain/event/implements/Event";
import BrokerInterface from "../../../../src/domain/infra/broker/Broker";

export default class MemoryBroker implements BrokerInterface {
  handlers: HandlerInterface[];

  constructor() {
    this.handlers = [];
  }

  register(handler: HandlerInterface) {
    this.handlers.push(handler);
  }

  publish(event: Event) {
    for (const handler of this.handlers) {
      if (handler.name === event.name) {
        handler.handle(event);
      }
    }
  }
}
