import MemoryBroker from "./infra/broker/MemoryBroker";
import S3StorageGateway from "./infra/gateway/S3StorageGateway";
import MemoryBandRepository from "./infra/repository/MemoryBandRepository";
import MemoryProfileRepository from "./infra/repository/MemoryProfileRepository";
import MemoryUserRepository from "./infra/repository/MemoryUserRepository";
import MemoryVideoRepository from "./infra/repository/MemoryVideoRepository";
import UserCreatedHandler from "./application/handler/UserCreatedHandler";
import EmailGateway from "./infra/gateway/EmailGateway";
import InviteAcceptedHandler from "./application/handler/InviteAcceptedHandler";
import InviteDeclinedHandler from "./application/handler/InviteDeclinedHandler";
import InviteMemberHandler from "./application/handler/InviteMemberHandler";

const userRepository = new MemoryUserRepository();
const profileRepository = new MemoryProfileRepository();
const broker = new MemoryBroker();
const emailGateway = new EmailGateway();
broker.register(new UserCreatedHandler(emailGateway));
broker.register(new InviteAcceptedHandler(userRepository, profileRepository, emailGateway));
broker.register(new InviteDeclinedHandler(userRepository, profileRepository, emailGateway));
broker.register(new InviteMemberHandler(userRepository, emailGateway));

export const config = {
  profileRepository,
  userRepository,
  videoRepository: new MemoryVideoRepository(),
  bandRepository: new MemoryBandRepository(),
  broker,
  storage: new S3StorageGateway(),
};
