import Event from "../../../domain/event/implements/Event";

export default interface HandlerInterface {
  name: string;
  handle(event: Event): void;
}
