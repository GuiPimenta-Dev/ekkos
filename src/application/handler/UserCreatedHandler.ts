import EmailGatewayInterface from "../../domain/infra/gateway/EmailGateway";
import HandlerInterface from "./implements/Handler";
import { UserCreated } from "../../domain/event/EventFactory";

export default class UserCreatedHandler implements HandlerInterface {
  constructor(private emailGateway: EmailGatewayInterface) {}
  name = "UserCreated";

  async handle({ payload }: UserCreated): Promise<void> {
    await this.emailGateway.send(payload.email, "Welcome to our app!", "Welcome to our app!");
  }
}
