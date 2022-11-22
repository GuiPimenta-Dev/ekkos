import UserRepositoryInterface from "../../domain/infra/repository/UserRepository";
import { v4 as uuid } from "uuid";
import User from "../../domain/entity/User";
import BrokerInterface from "../../domain/infra/broker/Broker";
import UserCreatedEvent from "../../domain/event/UserCreatedEvent";

export default class CreateAccount {
  constructor(private userRepository: UserRepositoryInterface, private broker: BrokerInterface) {}

  async execute(email: string, password: string): Promise<string> {
    if (await this.userRepository.isEmailTaken(email)) throw new Error("Email already taken");
    const id = uuid();
    const user = new User(id, email, password);
    this.userRepository.save(user);
    this.broker.publish(new UserCreatedEvent(email));
    return id;
  }
}
