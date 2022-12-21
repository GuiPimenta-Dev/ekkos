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
import RepositoryFactory from "../../utils/factory/RepositoryFactory";
import BandBuilder from "../../utils/builder/BandBuilder";

let bandRepository: BandRepositoryInterface;
let profileRepository: ProfileRepositoryInterface;
const broker = new MemoryBroker();

let factory: RepositoryFactory;
let builder: BandBuilder;

beforeEach(async () => {
  bandRepository = new MemoryBandRepository();
  profileRepository = new MemoryProfileRepository();
  factory = new RepositoryFactory({profileRepository});
  builder = new BandBuilder(bandRepository);
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
});

test("It should be able to invite a member", async () => {
  const admin = factory.createProfile();
  const member = factory.createProfile();
  const band = builder.createBand(admin.profileId);

  const usecase = new InviteMember(bandRepository, profileRepository, broker);
  const input = { bandId: band.bandId, profileId: member.profileId, adminId: admin.profileId, role: "guitarist" };
  const inviteId = await usecase.execute(input);

  const invite = await bandRepository.findInviteById(inviteId);
  expect(invite).toBeDefined();
  expect(invite.role).toBe("guitarist");
  expect(invite.status).toBe("pending");
});

test("It should directly add the member if it is the adminId choosing a second role", async () => {
  const admin = factory.createProfile();
  const { bandId } = builder.createBand(admin.profileId);

  const usecase = new InviteMember(bandRepository, profileRepository, broker);
  const input = { bandId, profileId: admin.profileId, adminId: admin.profileId, role: "guitarist" };
  await usecase.execute(input);

  const band = await bandRepository.findBandById(bandId);
  expect(band.getMembers()).toHaveLength(2);
});

test("It should not be able to invite a member if member does not exists", async () => {
  const admin = factory.createProfile();
  const { bandId } = builder.createBand(admin.profileId);

  const usecase = new InviteMember(bandRepository, profileRepository, broker);
  const input = { bandId, adminId: admin.profileId, profileId: "invalid-profile-id", role: "guitarist" };
  expect(usecase.execute(input)).rejects.toThrow("Profile not found");
});

test("It should be able to accept an invite", async () => {
  const admin = factory.createProfile();
  const member = factory.createProfile();
  const band = builder.createBand(admin.profileId).withInviteTo(member.profileId, "guitarist");

  const usecase = new AcceptInvite(bandRepository, broker);
  await usecase.execute(member.profileId, band.invite.inviteId);

  const {status} = await bandRepository.findInviteById(band.invite.inviteId);
  const _band = await bandRepository.findBandById(band.bandId);
  expect(status).toBe("accepted");
  expect(_band.getMembers()).toHaveLength(2);
});

test("It should be able to decline an invite", async () => {
  const admin = factory.createProfile();
  const member = factory.createProfile();
  const band = builder.createBand(admin.profileId).withInviteTo(member.profileId, "guitarist");

  const usecase = new DeclineInvite(bandRepository, broker);
  await usecase.execute(member.profileId, band.invite.inviteId);

  const {status} = await bandRepository.findInviteById(band.invite.inviteId);
  const _band = await bandRepository.findBandById(band.bandId);
  expect(status).toBe("declined");
  expect(_band.getMembers()).toHaveLength(1);
});

test("It should be able to open a vacancy", async () => {
  const admin = factory.createProfile();
  const { bandId } = builder.createBand(admin.profileId);

  const usecase = new OpenVacancy(bandRepository);
  await usecase.execute(admin.profileId, bandId, "guitarist");

  const band = await bandRepository.findBandById(bandId);
  expect(band.getVacancies()).toHaveLength(1);
});

test("It should not be able to remove a member if its not found", async () => {
  const admin = factory.createProfile();
  const { bandId } = builder.createBand(admin.profileId);

  const usecase = new RemoveMember(bandRepository);
  expect(usecase.execute(bandId, admin.profileId, "invalid-profile-id")).rejects.toThrow("Member not found");
});
