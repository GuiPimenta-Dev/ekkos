import MemoryBroker from "./infra/broker/MemoryBroker";
import S3StorageGateway from "./infra/gateway/S3StorageGateway";
import MemoryBandRepository from "./infra/repository/MemoryBandRepository";
import MemoryProfileRepository from "./infra/repository/MemoryProfileRepository";
import MemoryUserRepository from "./infra/repository/MemoryUserRepository";
import MemoryVideoRepository from "./infra/repository/MemoryVideoRepository";
import UserCreatedHandler from "./application/handler/UserCreatedHandler";
import EmailGateway from "./infra/gateway/EmailGateway";

const broker = new MemoryBroker();
const emailGateway = new EmailGateway();
broker.register(new UserCreatedHandler(emailGateway));

export const config = {
  profileRepository: new MemoryProfileRepository(),
  userRepository: new MemoryUserRepository(),
  videoRepository: new MemoryVideoRepository(),
  bandRepository: new MemoryBandRepository(),
  broker,
  storage: new S3StorageGateway(),
};
