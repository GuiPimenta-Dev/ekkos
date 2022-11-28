import EmailGatewayInterface from "../../domain/infra/gateway/EmailGateway";
import UserCreatedEvent from "../../domain/event/UserCreatedEvent";
import HandlerInterface from "./implements/Handler";

export default class UserCreatedHandler implements HandlerInterface {
  constructor(private emailGateway: EmailGatewayInterface) {}
  name = "UserCreated";

  async handle(event: UserCreatedEvent): Promise<void> {
    await this.emailGateway.send(event.email, "Welcome to our app!", "Welcome to our app!");
  }
}
