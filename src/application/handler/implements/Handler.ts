import { Event } from "../../../domain/event/EventFactory";

export default interface HandlerInterface {
  name: string;
  handle(event: Event): void;
}
