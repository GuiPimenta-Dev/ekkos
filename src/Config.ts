import MemoryBroker from "../tests/utils/mocks/broker/MemoryBroker";
import S3StorageGateway from "./infra/gateway/S3StorageGateway";
import MemoryBandRepository from "./infra/repository/MemoryBandRepository";
import MemoryProfileRepository from "./infra/repository/MemoryProfileRepository";
import MemoryUserRepository from "./infra/repository/MemoryUserRepository";
import MemoryVideoRepository from "./infra/repository/MemoryVideoRepository";

export const config = {
  profileRepository: new MemoryProfileRepository(),
  userRepository: new MemoryUserRepository(),
  videoRepository: new MemoryVideoRepository(),
  bandRepository: new MemoryBandRepository(),
  broker: new MemoryBroker(),
  storage: new S3StorageGateway(),
};
