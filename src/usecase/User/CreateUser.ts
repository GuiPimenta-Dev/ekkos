import { v4 as uuid } from "uuid";
import BadRequest from "../../application/http/BadRequest";
import User from "../../domain/entity/User";
import EventFactory from "../../domain/event/EventFactory";
import BrokerInterface from "../../domain/infra/broker/Broker";
import UserRepositoryInterface from "../../domain/infra/repository/UserRepository";

export default class CreateUser {
  constructor(private userRepository: UserRepositoryInterface, private broker: BrokerInterface) {}

  async execute(email: string, password: string): Promise<string> {
    if (await this.userRepository.isEmailTaken(email)) throw new BadRequest("Email already taken");
    const id = uuid();
    const user = new User(id, email, password);
    this.userRepository.save(user);
    this.broker.publish(EventFactory.emitUserCreated({ email }));
    return id;
  }
}
