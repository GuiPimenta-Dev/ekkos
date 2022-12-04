import BandRepositoryInterface from "../../../src/domain/infra/repository/BandRepositoryInterface";
import ProfileRepositoryInterface from "../../../src/domain/infra/repository/ProfileRepositoryInterface";
import MemoryBandRepository from "../../../src/infra/repository/MemoryBandRepository";
import MemoryProfileRepository from "../../../src/infra/repository/MemoryProfileRepository";
import InviteMember from "../../../src/usecase/band/InviteMember";
import CreateBand from "../../../src/usecase/band/CreateBand";
import MemoryBroker from "../../../src/infra/broker/MemoryBroker";
import MemoryUserRepository from "../../../src/infra/repository/MemoryUserRepository";
import EmailGatewayFake from "../../utils/mocks/gateway/EmailGatewayFake";
import InviteMemberHandler from "../../../src/application/handler/MemberInvitedHandler";
import AcceptInvite from "../../../src/usecase/band/AcceptInvite";
import InviteAcceptedHandler from "../../../src/application/handler/InviteAcceptedHandler";
import DeclineInvite from "../../../src/usecase/band/DeclineInvite";
import InviteDeclinedHandler from "../../../src/application/handler/InviteDeclinedHandler";
import OpenVacancy from "../../../src/usecase/band/OpenVacancy";
import RemoveMember from "../../../src/usecase/band/RemoveMember";

let bandRepository: BandRepositoryInterface;
let profileRepository: ProfileRepositoryInterface;
const broker = new MemoryBroker();
const bandId = "bandId";

beforeEach(async () => {
  bandRepository = new MemoryBandRepository();
  profileRepository = new MemoryProfileRepository();
});

test("It should be able to create a band", async () => {
  const bandRepository = new MemoryBandRepository();
  const usecase = new CreateBand(bandRepository);
  await usecase.execute({
    name: "name",
    description: "description",
    logo: "logo",
    profileId: "1",
  });
  expect(bandRepository.bands).toHaveLength(2);
});

test("It should be able to invite a member", async () => {
  const usecase = new InviteMember(bandRepository, profileRepository, broker);
  const input = { bandId, profileId: "2", adminId: "1", role: "guitarist" };
  const inviteId = await usecase.execute(input);
  const invite = await bandRepository.findInviteById(inviteId);
  expect(invite).toBeDefined();
  expect(invite.role).toBe("guitarist");
  expect(invite.status).toBe("pending");
});

test("It should directly add the member if it is the adminId choosing a second role", async () => {
  const usecase = new InviteMember(bandRepository, profileRepository, broker);
  const input = { bandId, profileId: "1", adminId: "1", role: "guitarist" };
  await usecase.execute(input);
  const band = await bandRepository.findBandById(bandId);
  expect(band.getMembers()).toHaveLength(3);
});

test("It should not be able to invite a member if member does not exists", async () => {
  const usecase = new InviteMember(bandRepository, profileRepository, broker);
  const input = { bandId, adminId: "1", profileId: "profile", role: "guitarist" };
  expect(usecase.execute(input)).rejects.toThrow("Profile not found");
});

test("It should be able to accept an invite", async () => {
  const usecase = new AcceptInvite(bandRepository, broker);
  await usecase.execute("3", "2");
  const invite = await bandRepository.findInviteById("2");
  const band = await bandRepository.findBandById(bandId);
  expect(invite.status).toBe("accepted");
  expect(band.getMembers()).toHaveLength(3);
});

test("An email should be sent to each member after an invite accepted", async () => {
  const broker = new MemoryBroker();
  const emailGateway = new EmailGatewayFake();
  const handler = new InviteAcceptedHandler(new MemoryUserRepository(), profileRepository, emailGateway);
  broker.register(handler);
  const usecase = new AcceptInvite(bandRepository, broker);
  await usecase.execute("3", "2");
  expect(emailGateway.emails).toHaveLength(2);
});

test("It should be able to decline an invite", async () => {
  const usecase = new DeclineInvite(bandRepository, broker);
  await usecase.execute("3", "2");
  const invite = await bandRepository.findInviteById("2");
  const band = await bandRepository.findBandById(bandId);
  expect(invite.status).toBe("declined");
  expect(band.getMembers()).toHaveLength(2);
});

test("It should be able to open a vacancy", async () => {
  const usecase = new OpenVacancy(bandRepository);
  await usecase.execute("1", bandId, "guitarist");
  const band = await bandRepository.findBandById(bandId);
  expect(band.getVacancies()).toHaveLength(2);
});

test("It should not be able to remove a member if its not found", async () => {
  const usecase = new RemoveMember(bandRepository);
  expect(usecase.execute(bandId, "1", "3")).rejects.toThrow("Member not found");
});
