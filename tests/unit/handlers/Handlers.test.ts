import InviteAcceptedHandler from "../../../src/application/handler/InviteAcceptedHandler";
import InviteDeclinedHandler from "../../../src/application/handler/InviteDeclinedHandler";
import InviteMemberHandler from "../../../src/application/handler/MemberInvitedHandler";
import UserCreatedHandler from "../../../src/application/handler/UserCreatedHandler";
import EventFactory from "../../../src/domain/event/EventFactory";
import MemoryBroker from "../../../src/infra/broker/MemoryBroker";
import MemoryProfileRepository from "../../../src/infra/repository/MemoryProfileRepository";
import MemoryUserRepository from "../../../src/infra/repository/MemoryUserRepository";
import EmailGatewayFake from "../../utils/mocks/gateway/EmailGatewayFake";
import MemberDTO from "../../../src/dto/MemberDTO";
import BrokerInterface from "../../../src/application/ports/broker/BrokerInterface";
import MemoryFeedRepository from "../../../src/infra/repository/MemoryFeedRepository";
import Profile from "../../../src/domain/entity/Profile";
import VideoPostedHandler from "../../../src/application/handler/VideoPostedHandler";
import RepositoryFactory from "../../utils/factory/RepositoryFactory";

let emailGateway: EmailGatewayFake;
let feedRepository: MemoryFeedRepository;
let broker: BrokerInterface;
let factory: RepositoryFactory;


beforeEach(async () => {
  const userRepository = new MemoryUserRepository();
  const profileRepository = new MemoryProfileRepository();
  factory = new RepositoryFactory({profileRepository, userRepository});
  emailGateway = new EmailGatewayFake();
  feedRepository = new MemoryFeedRepository();
  broker = new MemoryBroker();
  broker.register(new UserCreatedHandler(emailGateway));
  broker.register(new InviteAcceptedHandler(userRepository, profileRepository, emailGateway));
  broker.register(new InviteDeclinedHandler(userRepository, profileRepository, emailGateway));
  broker.register(new InviteMemberHandler(userRepository, emailGateway));
  broker.register(new VideoPostedHandler(feedRepository, profileRepository));
});

test("An event should be published when a user is created", async () => {
  await broker.publish(EventFactory.emitUserCreated({ email: "user@test.com" }));

  expect(emailGateway.emails).toHaveLength(1);
});

test("An email should be sent after inviting a member", async () => {
  const user = factory.createUser()

  await broker.publish(EventFactory.emitMemberInvited({ profileId: user.userId, bandName: "bandName", role: "guitarist" }));
  
  expect(emailGateway.emails).toHaveLength(1);
});

test("An email should be sent to the band members after accepting an invite", async () => {
  const user = factory.createUser()
  const band = factory.createBand(user.userId)
  const profile = factory.createProfile()

  await broker.publish(EventFactory.emitInviteAccepted({ profileId: profile.profileId, band, role: "guitarist" }));

  expect(emailGateway.emails).toHaveLength(1);
});

test("An email should be sent after declining an invite", async () => {
  const user = factory.createUser()
  const band = factory.createBand(user.userId)
  const profile = factory.createProfile()

  await broker.publish(EventFactory.emitInviteDeclined({ profileId: profile.profileId, band, role: "guitarist" }));
  
  expect(emailGateway.emails).toHaveLength(1);
});

test("A follower should be notified by future posts", async () => {
  const profile = factory.createProfile()
  const video = factory.createVideo(profile.profileId)

  await broker.publish(EventFactory.emitVideoPosted({ profileId: profile.profileId, videoId: video.videoId }));

  expect(feedRepository.posts).toHaveLength(1);
});
