import InviteAcceptedHandler from "../../../src/application/handler/InviteAcceptedHandler";
import InviteDeclinedHandler from "../../../src/application/handler/InviteDeclinedHandler";
import InviteMemberHandler from "../../../src/application/handler/MemberInvitedHandler";
import UserCreatedHandler from "../../../src/application/handler/UserCreatedHandler";
import EventFactory from "../../../src/domain/event/EventFactory";
import MemoryBroker from "../../../src/infra/broker/MemoryBroker";
import MemoryProfileRepository from "../../../src/infra/repository/MemoryProfileRepository";
import MemoryUserRepository from "../../../src/infra/repository/MemoryUserRepository";
import EmailGatewayFake from "../../utils/mocks/gateway/EmailGatewayFake";
import BrokerInterface from "../../../src/application/ports/broker/BrokerInterface";
import MemoryFeedRepository from "../../../src/infra/repository/MemoryFeedRepository";
import VideoPostedHandler from "../../../src/application/handler/VideoPostedHandler";
import Builder from "../../utils/builder/Builder";
import UserRepositoryInterface from "../../../src/application/ports/repository/UserRepositoryInterface";
import ProfileRepositoryInterface from "../../../src/application/ports/repository/ProfileRepositoryInterface";
import Member from "../../../src/domain/entity/band/Member";

let emailGateway: EmailGatewayFake;
let feedRepository: MemoryFeedRepository;
let userRepository: UserRepositoryInterface;
let profileRepository: ProfileRepositoryInterface;
let broker: BrokerInterface;
let A: Builder;

beforeEach(async () => {
  A = new Builder();
  userRepository = new MemoryUserRepository();
  profileRepository = new MemoryProfileRepository();
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
  userRepository.create(A.User.build());

  await broker.publish(
    EventFactory.emitMemberInvited({ profileId: "userId", bandName: "bandName", role: "guitarist" }),
  );

  expect(emailGateway.emails).toHaveLength(1);
});

test("An email should be sent to the band members after accepting an invite", async () => {
  userRepository.create(A.User.withId("adminId").build());
  profileRepository.create(A.Profile.build());
  const band = A.Band.withMember(Member.create("adminId", "guitarist")).build();

  await broker.publish(EventFactory.emitInviteAccepted({ profileId: "profileId", band, role: "guitarist" }));

  expect(emailGateway.emails).toHaveLength(1);
});

test("An email should be sent after declining an invite", async () => {
  userRepository.create(A.User.withId("adminId").build());
  profileRepository.create(A.Profile.build());
  const band = A.Band.withMember(Member.create("adminId", "guitarist")).build();

  await broker.publish(EventFactory.emitInviteDeclined({ profileId: "profileId", band, role: "guitarist" }));

  expect(emailGateway.emails).toHaveLength(1);
});

test("A follower should be notified by future posts", async () => {
  profileRepository.create(A.Profile.build());

  await broker.publish(EventFactory.emitVideoPosted({ profileId: "profileId", videoId: "videoId" }));

  expect(feedRepository.posts).toHaveLength(1);
});
