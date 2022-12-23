import { v4 as uuid } from "uuid";
import BadRequest from "../../application/http/BadRequest";
import User from "../../domain/entity/User";
import EventFactory from "../../domain/event/EventFactory";
import BrokerInterface from "../../application/ports/broker/BrokerInterface";
import UserRepositoryInterface from "../../application/ports/repository/UserRepositoryInterface";

export default class CreateUser {
  constructor(private userRepository: UserRepositoryInterface, private broker: BrokerInterface) {}

  async execute(email: string, password: string): Promise<string> {
    if (await this.userRepository.isEmailTaken(email)) throw new BadRequest("Email already taken");
    const userId = uuid();
    const user = new User(userId, email, password);
    this.userRepository.create(user);
    this.broker.publish(EventFactory.emitUserCreated({ email }));
    return userId;
  }
}
