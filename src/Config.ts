import MemoryBandRepository from "./infra/repository/memory/MemoryBandRepository";
import MemoryBroker from "./infra/broker/MemoryBroker";
import MemoryProfileRepository from "./infra/repository/memory/MemoryProfileRepository";
import MemoryUserRepository from "./infra/repository/memory/MemoryUserRepository";
import MemoryVideoRepository from "./infra/repository/memory/MemoryVideoRepository";
import S3StorageGateway from "./infra/gateway/S3StorageGateway";

export const config = {
  profileRepository: new MemoryProfileRepository(),
  userRepository: new MemoryUserRepository(),
  videoRepository: new MemoryVideoRepository(),
  bandRepository: new MemoryBandRepository(),
  broker: new MemoryBroker(),
  storage: new S3StorageGateway(),
};
