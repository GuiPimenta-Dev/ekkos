import MemoryBroker from "./infra/broker/MemoryBroker";
import MemoryProfileRepository from "./infra/repository/memory/MemoryProfileRepository";
import MemoryUserRepository from "./infra/repository/memory/MemoryUserRepository";
import MemoryVideoRepository from "./infra/repository/memory/MemoryVideoRepository";
import S3StorageGateway from "./infra/gateway/S3StorageGateway";

export let config = {
  profileRepository: new MemoryProfileRepository(),
  userRepository: new MemoryUserRepository(),
  videoRepository: new MemoryVideoRepository(),
  broker: new MemoryBroker(),
  storage: new S3StorageGateway(),
};
