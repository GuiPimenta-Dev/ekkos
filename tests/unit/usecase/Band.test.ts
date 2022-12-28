import BandRepositoryInterface from "../../../src/application/ports/repository/BandRepositoryInterface";
import ProfileRepositoryInterface from "../../../src/application/ports/repository/ProfileRepositoryInterface";
import MemoryBandRepository from "../../../src/infra/repository/MemoryBandRepository";
import MemoryProfileRepository from "../../../src/infra/repository/MemoryProfileRepository";
import InviteMember from "../../../src/usecase/band/InviteMember";
import CreateBand from "../../../src/usecase/band/CreateBand";
import MemoryBroker from "../../../src/infra/broker/MemoryBroker";
import AcceptInvite from "../../../src/usecase/band/AcceptInvite";
import DeclineInvite from "../../../src/usecase/band/DeclineInvite";
import OpenVacancy from "../../../src/usecase/band/OpenVacancy";
import RemoveMember from "../../../src/usecase/band/RemoveMember";
import Builder from "../../utils/builder/Builder";
import Invite from "../../../src/domain/entity/band/Invite";

let bandRepository: BandRepositoryInterface;
let profileRepository: ProfileRepositoryInterface;
let A: Builder;
const broker = new MemoryBroker();

beforeEach(async () => {
  bandRepository = new MemoryBandRepository();
  profileRepository = new MemoryProfileRepository();
  A = new Builder();
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

  expect(bandRepository.bands).toHaveLength(1);
  expect(bandRepository.bands[0].getMembers()).toHaveLength(1);
});

test("It should be able to invite a member", async () => {
  profileRepository.create(A.Profile.withId("adminId").build());
  profileRepository.create(A.Profile.withId("memberId").build());
  bandRepository.create(A.Band.withAdminId("adminId").build());

  const usecase = new InviteMember(bandRepository, profileRepository, broker);
  const input = { bandId: "bandId", profileId: "memberId", adminId: "adminId", role: "guitarist" };
  const inviteId = await usecase.execute(input);

  const invite = await bandRepository.findInviteById(inviteId);
  expect(invite).toBeDefined();
  expect(invite.role).toBe("guitarist");
  expect(invite.getStatus()).toBe("pending");
});

test("It should directly add the member if it is the adminId choosing a second role", async () => {
  profileRepository.create(A.Profile.withId("adminId").build());
  bandRepository.create(A.Band.build());

  const usecase = new InviteMember(bandRepository, profileRepository, broker);
  const input = { bandId: "bandId", profileId: "adminId", adminId: "adminId", role: "guitarist" };
  await usecase.execute(input);

  const band = await bandRepository.findBandById("bandId");
  expect(band.getMembers()).toHaveLength(1);
});

test("It should not be able to invite a member if member does not exists", async () => {
  profileRepository.create(A.Profile.withId("adminId").build());
  bandRepository.create(A.Band.build());

  const usecase = new InviteMember(bandRepository, profileRepository, broker);
  const input = { bandId: "bandId", adminId: "adminId", profileId: "invalid-profile-id", role: "guitarist" };
  expect(usecase.execute(input)).rejects.toThrow("Profile not found");
});

test("It should be able to accept an invite", async () => {
  const invite = Invite.create("bandId", "memberId", "guitarist");
  profileRepository.create(A.Profile.withId("adminId").build());
  profileRepository.create(A.Profile.withId("memberId").build());
  bandRepository.create(A.Band.build());
  bandRepository.createInvite(invite);

  const usecase = new AcceptInvite(bandRepository, broker);
  await usecase.execute("memberId", invite.id);

  const _invite = await bandRepository.findInviteById(invite.id);
  const _band = await bandRepository.findBandById("bandId");
  expect(_invite.getStatus()).toBe("accepted");
  expect(_band.getMembers()).toHaveLength(1);
});

test("It should be able to decline an invite", async () => {
  bandRepository = new MemoryBandRepository();
  const invite = Invite.create("bandId", "memberId", "guitarist");
  profileRepository.create(A.Profile.withId("adminId").build());
  profileRepository.create(A.Profile.withId("memberId").build());
  bandRepository.create(A.Band.build());
  bandRepository.createInvite(invite);

  const usecase = new DeclineInvite(bandRepository, broker);
  await usecase.execute("memberId", invite.id);

  const _invite = await bandRepository.findInviteById(invite.id);
  const _band = await bandRepository.findBandById("bandId");
  expect(_invite.getStatus()).toBe("declined");
  expect(_band.getMembers()).toHaveLength(0);
});

test("It should be able to open a vacancy", async () => {
  profileRepository.create(A.Profile.withId("adminId").build());
  bandRepository.create(A.Band.build());

  const usecase = new OpenVacancy(bandRepository);
  await usecase.execute("adminId", "bandId", "guitarist");

  const band = await bandRepository.findBandById("bandId");
  expect(band.getVacancies()).toHaveLength(1);
});

test("It should not be able to remove a member if its not found", async () => {
  profileRepository.create(A.Profile.withId("adminId").build());
  bandRepository.create(A.Band.build());

  const usecase = new RemoveMember(bandRepository);
  expect(usecase.execute("bandId", "adminId", "invalid-profile-id")).rejects.toThrow("Member not found");
});
