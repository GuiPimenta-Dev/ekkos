import HandlerInterface from "../../../../src/application/handler/implements/Handler";
import DomainEvent from "../../../../src/domain/event/implements/DomainEvent";
import BrokerInterface from "../../../../src/domain/infra/broker/Broker";

export default class MemoryBroker implements BrokerInterface {
  handlers: HandlerInterface[];

  constructor() {
    this.handlers = [];
  }

  register(handler: HandlerInterface) {
    this.handlers.push(handler);
  }

  publish(event: DomainEvent) {
    for (const handler of this.handlers) {
      if (handler.name === event.name) {
        handler.handle(event);
      }
    }
  }
}
