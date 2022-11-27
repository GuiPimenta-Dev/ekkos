import MemoryBroker from "../tests/utils/mocks/broker/MemoryBroker";
import S3StorageGateway from "./infra/gateway/S3StorageGateway";
import MemoryBandRepository from "../tests/utils/mocks/repository/MemoryBandRepository";
import MemoryProfileRepository from "../tests/utils/mocks/repository/MemoryProfileRepository";
import MemoryUserRepository from "../tests/utils/mocks/repository/MemoryUserRepository";
import MemoryVideoRepository from "../tests/utils/mocks/repository/MemoryVideoRepository";

export const config = {
  profileRepository: new MemoryProfileRepository(),
  userRepository: new MemoryUserRepository(),
  videoRepository: new MemoryVideoRepository(),
  bandRepository: new MemoryBandRepository(),
  broker: new MemoryBroker(),
  storage: new S3StorageGateway(),
};
