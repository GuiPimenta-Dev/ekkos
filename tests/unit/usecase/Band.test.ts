import BandRepositoryInterface from "../../../src/domain/infra/repository/BandRepository";
import ProfileRepositoryInterface from "../../../src/domain/infra/repository/ProfileRepository";
import MemoryBandRepository from "../../../src/infra/repository/MemoryBandRepository";
import MemoryProfileRepository from "../../../src/infra/repository/MemoryProfileRepository";
import InviteMember from "../../../src/usecase/band/InviteMember";
import CreateBand from "../../../src/usecase/band/CreateBand";
import GetBand from "../../../src/usecase/band/GetBand";
import MemoryBroker from "../../../src/infra/broker/MemoryBroker";
import MemoryUserRepository from "../../../src/infra/repository/MemoryUserRepository";
import EmailGatewayFake from "../../utils/mocks/gateway/EmailGatewayFake";
import MemberInvitedHandler from "../../../src/application/handler/MemberInvitedHandler";
import AcceptInvitation from "../../../src/usecase/band/AcceptInvitation";
import InviteAcceptedHandler from "../../../src/application/handler/InviteAcceptedHandler";
import DeclineInvitation from "../../../src/usecase/band/DeclineInvitation";
import InviteDeclinedHandler from "../../../src/application/handler/InviteDeclinedHandler";

let bandRepository: BandRepositoryInterface;
let profileRepository: ProfileRepositoryInterface;
const broker = new MemoryBroker();
const bandId = "bandId";

beforeEach(async () => {
  bandRepository = new MemoryBandRepository();
  profileRepository = new MemoryProfileRepository();
});

describe("InviteMember", () => {
  test("It should be able to create a band", async () => {
    const bandRepository = new MemoryBandRepository();
    const usecase = new CreateBand(bandRepository);
    await usecase.execute({
      name: "name",
      description: "description",
      logo: "logo",
      profileId: "1",
      role: "guitarist",
    });
    expect(bandRepository.bands).toHaveLength(2);
  });

  test("It should not be able to create a band with an invalid role", async () => {
    const bandRepository = new MemoryBandRepository();
    const usecase = new CreateBand(bandRepository);
    expect(
      usecase.execute({
        name: "name",
        description: "description",
        logo: "logo",
        profileId: "adminId",
        role: "wrong_role",
      })
    ).rejects.toThrow("Role is invalid");
  });

  test("It should be able to invite a member", async () => {
    const usecase = new InviteMember(bandRepository, profileRepository, broker);
    const input = { bandId, profileId: "2", adminId: "1", role: "guitarist" };
    const invitationId = await usecase.execute(input);
    const invitation = await bandRepository.findInvitationById(invitationId);
    expect(invitation).toBeDefined();
    expect(invitation.role).toBe("guitarist");
    expect(invitation.status).toBe("pending");
  });

  test("It should directly add the member if it is the adminId choosing a second role", async () => {
    const usecase = new InviteMember(bandRepository, profileRepository, broker);
    const input = { bandId, profileId: "1", adminId: "1", role: "guitarist" };
    await usecase.execute(input);
    const band = await bandRepository.findBandById(bandId);
    expect(band.getMembers()).toHaveLength(3);
  });

  test("An email should be sent after inviting a member", async () => {
    const userRepository = new MemoryUserRepository();
    const broker = new MemoryBroker();
    const emailGateway = new EmailGatewayFake();
    const handler = new MemberInvitedHandler(userRepository, emailGateway);
    broker.register(handler);
    const usecase = new InviteMember(bandRepository, profileRepository, broker);
    const input = { bandId, profileId: "2", adminId: "1", role: "guitarist" };
    await usecase.execute(input);
    expect(emailGateway.emails).toHaveLength(1);
  });

  test("It should not be able to invite a member if member does not exists", async () => {
    const usecase = new InviteMember(bandRepository, profileRepository, broker);
    const input = { bandId, adminId: "1", profileId: "profile", role: "guitarist" };
    expect(usecase.execute(input)).rejects.toThrow("Profile not found");
  });

  test("It should not be able to invite a member if role does not exists", async () => {
    const usecase = new InviteMember(bandRepository, profileRepository, broker);
    const input = { bandId, adminId: "1", profileId: "2", role: "guitaarist" };
    expect(usecase.execute(input)).rejects.toThrow("Role is invalid");
  });

  test("It should be able to accept an invitation", async () => {
    const usecase = new AcceptInvitation(bandRepository, broker);
    await usecase.execute("3", "2");
    const invitation = await bandRepository.findInvitationById("2");
    const band = await bandRepository.findBandById(bandId);
    expect(invitation.status).toBe("accepted");
    expect(band.getMembers()).toHaveLength(3);
  });

  test("An email should be sent to each member after an invite accepted", async () => {
    const broker = new MemoryBroker();
    const emailGateway = new EmailGatewayFake();
    const handler = new InviteAcceptedHandler(new MemoryUserRepository(), profileRepository, emailGateway);
    broker.register(handler);
    const usecase = new AcceptInvitation(bandRepository, broker);
    await usecase.execute("3", "2");
    expect(emailGateway.emails).toHaveLength(2);
  });

  test("It should be able to decline an invitation", async () => {
    const usecase = new DeclineInvitation(bandRepository, broker);
    await usecase.execute("3", "2");
    const invitation = await bandRepository.findInvitationById("2");
    const band = await bandRepository.findBandById(bandId);
    expect(invitation.status).toBe("declined");
    expect(band.getMembers()).toHaveLength(2);
  });

  test("An email should be sent to each member after an invite is declined", async () => {
    const broker = new MemoryBroker();
    const emailGateway = new EmailGatewayFake();
    const handler = new InviteDeclinedHandler(new MemoryUserRepository(), profileRepository, emailGateway);
    broker.register(handler);
    const usecase = new DeclineInvitation(bandRepository, broker);
    await usecase.execute("3", "2");
    expect(emailGateway.emails).toHaveLength(2);
  });

  test("It should be able to get a band", async () => {
    const usecase = new GetBand(new MemoryBandRepository());
    const band = await usecase.execute(bandId);
    expect(band).toHaveProperty("bandId");
    expect(band.name).toBe("name");
    expect(band.logo).toBe("logo");
    expect(band.description).toBe("description");
    expect(band.adminId).toBe("1");
    expect(band.members).toHaveLength(2);
  });
});
