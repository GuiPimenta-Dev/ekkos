import MemoryBroker from "./infra/broker/MemoryBroker";
import S3StorageGateway from "./infra/gateway/S3StorageGateway";
import MemoryBandRepository from "./infra/repository/MemoryBandRepository";
import MemoryProfileRepository from "./infra/repository/MemoryProfileRepository";
import MemoryUserRepository from "./infra/repository/MemoryUserRepository";
import MemoryVideoRepository from "./infra/repository/MemoryVideoRepository";
import UserCreatedHandler from "./application/handler/UserCreatedHandler";
import InviteAcceptedHandler from "./application/handler/InviteAcceptedHandler";
import InviteDeclinedHandler from "./application/handler/InviteDeclinedHandler";
import InviteMemberHandler from "./application/handler/MemberInvitedHandler";
import EmailGatewayFake from "../tests/utils/mocks/gateway/EmailGatewayFake";
import StorageGatewayFake from "../tests/utils/mocks/gateway/StorageGatewayFake";
import EmailGateway from "./infra/gateway/EmailGateway";
import MemoryFeedRepository from "./infra/repository/MemoryFeedRepository";

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
  feedRepository: new MemoryFeedRepository(),
  broker,
  storage: new StorageGatewayFake(),
};
