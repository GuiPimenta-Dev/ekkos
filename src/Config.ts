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
import StorageGatewayFake from "../tests/utils/mocks/gateway/StorageGatewayFake";
import EmailGateway from "./infra/gateway/EmailGateway";
import MemoryFeedRepository from "./infra/repository/MemoryFeedRepository";
import Profile from "./domain/entity/Profile";
import User from "./domain/entity/User";

const userRepository = new MemoryUserRepository();
userRepository.save(new User("1", "user_1@test.com", "123456"));
const profileRepository = new MemoryProfileRepository();
profileRepository.save(new Profile("1", "user_1", "avatar", -22.90045, -43.11867, [], []));
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
