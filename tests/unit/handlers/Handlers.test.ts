import InviteAcceptedHandler from "../../../src/application/handler/InviteAcceptedHandler";
import InviteDeclinedHandler from "../../../src/application/handler/InviteDeclinedHandler";
import InviteMemberHandler from "../../../src/application/handler/MemberInvitedHandler";
import UserCreatedHandler from "../../../src/application/handler/UserCreatedHandler";
import Band from "../../../src/domain/entity/Band";
import EventFactory from "../../../src/domain/event/EventFactory";
import BandRepositoryInterface from "../../../src/domain/infra/repository/BandRepositoryInterface";
import ProfileRepositoryInterface from "../../../src/domain/infra/repository/ProfileRepositoryInterface";
import MemoryBroker from "../../../src/infra/broker/MemoryBroker";
import MemoryBandRepository from "../../../src/infra/repository/MemoryBandRepository";
import MemoryProfileRepository from "../../../src/infra/repository/MemoryProfileRepository";
import MemoryUserRepository from "../../../src/infra/repository/MemoryUserRepository";
import EmailGatewayFake from "../../utils/mocks/gateway/EmailGatewayFake";
import MemberDTO from "../../../src/dto/MemberDTO";
import BrokerInterface from "../../../src/domain/infra/broker/BrokerInterface";
import EmailGatewayInterface from "../../../src/domain/infra/gateway/EmailGatewayInterface";

let members: MemberDTO[];
let band: Band;
let broker: BrokerInterface;
let emailGateway: EmailGatewayFake;
beforeEach(async () => {
  members = [
    { memberId: "member_2", profileId: "2", role: "guitarist" },
    { memberId: "member_2", profileId: "2", role: "vocal" },
  ];
  band = new Band("bandId", "name", "description", "logo", "adminId", members);
  const userRepository = new MemoryUserRepository();
  const profileRepository = new MemoryProfileRepository();
  emailGateway = new EmailGatewayFake();
  broker = new MemoryBroker();
  broker.register(new UserCreatedHandler(emailGateway));
  broker.register(new InviteAcceptedHandler(userRepository, profileRepository, emailGateway));
  broker.register(new InviteDeclinedHandler(userRepository, profileRepository, emailGateway));
  broker.register(new InviteMemberHandler(userRepository, emailGateway));
});

test("An event should be published when a user is created", async () => {
  await broker.publish(EventFactory.emitUserCreated({ email: "user@test.com" }));
  expect(emailGateway.emails).toHaveLength(1);
});

test("An email should be sent after inviting a member", async () => {
  await broker.publish(EventFactory.emitMemberInvited({ profileId: "1", bandName: "bandName", role: "guitarist" }));
  expect(emailGateway.emails).toHaveLength(1);
});

test("An email should be sent to the band members after accepting an invite", async () => {
  await broker.publish(EventFactory.emitInviteAccepted({ profileId: "1", band, role: "guitarist" }));
  expect(emailGateway.emails).toHaveLength(1);
});

test("An email should be sent after declining an invite", async () => {
  await broker.publish(EventFactory.emitInviteDeclined({ profileId: "1", band, role: "guitarist" }));
  expect(emailGateway.emails).toHaveLength(1);
});
